const { Exception, errors, commonConstant, enums } = require('utils');
const { mongodb } = require('database');
const { Pizza_Ingredient: Ingredient, Pizza } = mongodb.Models;
const mongoose = require('mongoose');
const FileService = require('../file/service');
const _ = require('lodash');

class PizzaService {
	static refPath = commonConstant.refPath.Pizza;
	constructor(data, files) {
		this.category = data.category;
		this.title = data.title;
		this.subtitle = data.subtitle;
		this.description = data.description;
		this.includeTax = data.includeTax;
		this.discount = data.discount;
		if (data.crust)
			data.crust.map((value) => {
				value.layer = 'primary';
				value.section = 'crust';
			});
		this.crust = data.crust;
		this.files = [];
		if (files?.images) {
			const refPath = PizzaService.refPath.images;
			this.images = files.images.map((val) => {
				const file = new FileService(val, { refPath, disk: true });
				this.files.push(file);
				return file;
			});
		}
	}
	async #validate() {
		if (!this.crust) return;
		this.crust.flatMap((crust) =>
			crust.sizes.forEach((size) => {
				const precision = String(size.price).split('.')[1] || '';
				if (precision.length > 2) throw new Exception(errors.pizza.Crust_Price_Precision);
			})
		);

		const crustIngredients = this.crust.map((value) => value.ingredient);
		let sectionIngredients = this.crust.flatMap((value) =>
			value.sizes.flatMap((size) =>
				size.layers.flatMap((layer) =>
					layer.sections.flatMap((section) => section.allowedIngredients.flatMap((allowed) => allowed.ingredient))
				)
			)
		);
		sectionIngredients = Array.from(new Set(sectionIngredients));
		const totalIngredients = [...crustIngredients, ...sectionIngredients];
		const foundIngredients = await Ingredient.find({ _id: totalIngredients }, 'category', {
			populate: { path: 'category', select: 'name' },
		});
		const foundCrustIngredient = foundIngredients.filter((value) => crustIngredients.includes(value._id.toString()));
		const foundSectionIngredient = foundIngredients.filter((value) => sectionIngredients.includes(value._id.toString()));
		if (
			foundCrustIngredient.length !== crustIngredients.length ||
			foundSectionIngredient.length !== sectionIngredients.length
		)
			throw new Exception(errors.ingredient.Not_Found);
		const crustIngredientValid = foundCrustIngredient.every((value) => value.category.name == 'crust');
		const ingredientValid = foundSectionIngredient.every((value) => value.category.name != 'crust');
		if (!crustIngredientValid) throw new Exception(errors.pizza.Crust_Not_valid);
		if (!ingredientValid) throw new Exception(errors.pizza.Crust_In_AllowedIngredient);
		this.crust.forEach((crust) => {
			const crustDefault = crust.default;
			let sizeDefaultCount = 0;
			crust.sizes.forEach((size) => {
				const sizeDefault = size.default;
				if (sizeDefault) sizeDefaultCount++;
				let layerDefaultCount = 0;
				size.layers.forEach((layer, layerIndex) => {
					const layerMaxCount = layer.maxAllowedIngredient;
					const layerRequired = layer.required;
					if (layerRequired) layerDefaultCount++;
					let sectionRequiredCount = 0;
					layer.sections.forEach((section, sectionIndex) => {
						if (section.required) sectionRequiredCount++;
						const ingredientDefaultCount = section.allowedIngredients.reduce((pre, cur) => {
							if (cur.default) pre++;
							return pre;
						}, 0);
						if (section.required && !ingredientDefaultCount > 0)
							throw new Exception(errors.pizza.Default_Section_No_Ingredient);
						if (section.maxAllowedIngredient !== 0 && ingredientDefaultCount > section.maxAllowedIngredient)
							throw new Exception(errors.pizza.Default_Ingredient_Exceeded);
						const ingredients = section.allowedIngredients.map((value) => value.ingredient);
						const sectionIng = foundIngredients.filter((value) => ingredients.includes(value._id.toString()));
						let ingredient = sectionIng.map((x) => x.category.name);
						if (!ingredient.every((value) => value == section.category.toString())) {
							throw new Exception(errors.pizza.Section_Ingredient_Not_Same_Category(layerIndex, sectionIndex));
						}
						section.allowedIngredients.forEach((value) => {
							if (value.full) {
								const precision = String(value.full).split('.')[1] || '';
								if (precision.length > 2) throw new Exception(errors.pizza.Ingredient_Price_Precision);
							}
							if (value.half) {
								const precision = String(value.half).split('.')[1] || '';
								if (precision.length > 2) throw new Exception(errors.pizza.Ingredient_Price_Precision);
							}
							value.amounts?.forEach((val) => {
								if (val.full) {
									const precision = String(val.full).split('.')[1] || '';
									if (precision.length > 2) throw new Exception(errors.pizza.Ingredient_Price_Precision);
								}
								if (val.half) {
									const precision = String(val.half).split('.')[1] || '';
									if (precision.length > 2) throw new Exception(errors.pizza.Ingredient_Price_Precision);
								}
							});
						});
					});
					if (layerRequired && !sectionRequiredCount > 0) throw new Exception(errors.pizza.Default_Layer_No_Sections);
					if (layerMaxCount !== 0 && sectionRequiredCount > layerMaxCount)
						throw new Exception(errors.pizza.Default_Section_Exceeded);
				});
				if (sizeDefault && layerDefaultCount !== 1) throw new Exception(errors.pizza.Default_Size_No_Layer);
			});
			if (crustDefault && sizeDefaultCount !== 1) throw new Exception(errors.pizza.Crust_Default_No_Size);
		});
	}

	async save() {
		await this.#validate();
		const result = await new Pizza(this).save();
		return { data: { id: result.id } };
	}

	async update(_id, user) {
		await this.#validate();
		const result = await Pizza.accessibleBy(user.abilities, 'update').replaceOne({ _id }, this);
		if (!result.n > 0) throw new Exception(errors.pizza.Not_Found);
		return;
	}

	static async delete(_id, user) {
		const session = await mongoose.startSession();
		await session.withTransaction(async (session) => {
			const result = await Pizza.accessibleBy(user.abilities, 'delete').findOneAndDelete({ _id }, { session });
			if (!result) throw new Exception(errors.pizza.Not_Found);
			if (result.image) await FileService.delete(result.image, session);
		});
	}

	async updateFile(_id, user) {
		const session = await mongoose.startSession();
		await session.withTransaction(async (session) => {
			if (this.images) {
				const images = await FileService.saveArray(this.images, session);
				this.$push = { images };
				delete this.images;
			}
			const result = await Pizza.accessibleBy(user.abilities, 'update').findOneAndUpdate({ _id }, this, {
				session,
				omitUndefined: true,
			});
			if (!result) throw new Exception(errors.pizza.Not_Found);

			await Promise.all(this.files.map((val) => val.write()));
		});
	}

	static async deleteFile(_id, user) {
		const session = await mongoose.startSession();
		await session.withTransaction(async (session) => {
			const result = await Pizza.accessibleBy(user.abilities, 'update').findOneAndUpdate(
				{ _id },
				{ $unset: { images: 1 } },
				{ session, lean: true }
			);
			if (!result) throw new Exception(errors.pizza.Not_Found);
			if (!result.images) throw new Exception(errors.file.Not_Found);
			await FileService.deleteArray(result.images, session);
		});
	}

	static async getById(_id, user) {
		let result = await Pizza.findById(_id)
			.populate({
				path: 'images crust.ingredient crust.sizes.layers.sections.allowedIngredients.ingredient',
				populate: { path: 'category.icon icon defaultPicture images.image' },
			})
			.lean();
		if (!result) throw new Exception(errors.pizza.Not_Found);
		return { data: result };
	}

	static async getByCriteria(criteria, { skip, limit, total, view }, user) {
		if (criteria.title) criteria['title'] = new RegExp(`^${criteria.title}`, 'i');
		const result = await Pizza.findAndCount(total, criteria, 'title category images discount', {
			skip,
			limit,
			populate: 'images',
		});

		return result;
	}
}

module.exports = PizzaService;
