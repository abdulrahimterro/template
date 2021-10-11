const { Exception, errors, commonConstant, enums } = require('utils');
const { mongodb } = require('database');
const { Pizza_Ingredient: Ingredient, Pizza_IngredientCategory: IngredientCategory, Pizza } = mongodb.Models;
const mongoose = require('mongoose');
const FileService = require('../../file/service');
const _ = require('lodash');
class IngredientService {
	static refPath = commonConstant.refPath.Pizza_Ingredient;
	constructor(data, files) {
		this.category = data.category;
		this.title = data.title;
		this.description = data.description;
		this.amounts = data.amounts;
		this.sizes = data.sizes;
		this.files = [];
		if (files?.defaultPicture) {
			const refPath = IngredientService.refPath.defaultPicture;
			this.defaultPicture = new FileService(files.defaultPicture[0], { refPath, disk: true });
			this.files.push(this.defaultPicture);
		}
		if (files?.icon) {
			const refPath = IngredientService.refPath.icon;
			this.icon = new FileService(files.icon[0], { refPath, disk: true });
			this.files.push(this.icon);
		}
		if (files?.images) this.images = files.images[0];
	}

	async save() {
		let result, category;
		const session = await mongoose.startSession();
		await session.withTransaction(async (session) => {
			if (!this.defaultPicture || !this.icon) throw new Exception(errors.file.Not_Found);
			[this.defaultPicture, this.icon] = await Promise.all([this.defaultPicture.save(session), this.icon.save(session)]);
			[result, category] = await Promise.all([
				new Ingredient(this).save({ session }),
				IngredientCategory.findById(this.category).session(session),
			]);
			if (!category) throw new Exception(errors.category.Not_Found);
			await Promise.all(this.files.map((val) => val.write()));
		});
		return { data: { id: result.id } };
	}

	async update(_id, user) {
		const session = await mongoose.startSession();
		await session.withTransaction(async (session) => {
			if (this.defaultPicture) this.defaultPicture = await this.defaultPicture.save(session);
			if (this.icon) this.icon = await this.icon.save(session);
			if (this.category) {
				const category = await IngredientCategory.findById(this.category).session(session);
				if (!category) throw new Exception(errors.category.Not_Found);
			}

			const { files, ...data } = this;
			const result = await Ingredient.accessibleBy(user.abilities, 'update').findOneAndUpdate({ _id }, data, {
				session,
				omitUndefined: true,
			});
			if (!result) throw new Exception(errors.ingredient.Not_Found);
			if (this.defaultPicture && result.defaultPicture) await FileService.delete(result.defaultPicture, session);
			if (this.icon && result.icon) await FileService.delete(result.icon, session);
			await Promise.all(files.map((val) => val.write()));
		});
	}

	async updateFile(_id, user) {
		const session = await mongoose.startSession();
		await session.withTransaction(async (session) => {
			if (!this.images) throw new Exception(errors.file.Not_Found);
			if (!Ingredient.accessibleFieldsBy(user.abilities, 'update').includes('images'))
				throw new Exception(errors.auth.Unauthorized);
			const ingredient = await Ingredient.accessibleBy(user.abilities, 'update')
				.findOne({ _id }, 'images')
				.session(session);
			if (!ingredient) throw new Exception(errors.ingredient.Not_Found);
			const sizesArray = this.sizes || enums.toArray(enums.pizza.size.value);
			const amountsArray = this.amounts || enums.toArray(enums.pizza.amount.basic);
			const refPath = IngredientService.refPath.images;
			for (let index = 0; index < sizesArray.length * amountsArray.length; index++) {
				const uploadedImage = new FileService(this.images, { refPath, disk: true });
				this.files.push(uploadedImage);
			}
			const images = await FileService.saveArray(this.files, session);
			const oldImages = [];
			const ingredientImages = ingredient.images.toObject();
			sizesArray.forEach((size) => {
				amountsArray.forEach((amount) => {
					if (ingredientImages.length > 0) {
						const exist = ingredientImages.find((val) => val.amount == amount && val.size == size);
						if (exist) {
							oldImages.push(exist.image);
							const imageIndex = ingredientImages.findIndex((value) => value._id == exist._id);
							ingredient.images[imageIndex].image = images.pop();
						} else {
							ingredient.images.push({ image: images.pop(), size, amount });
						}
					} else {
						ingredient.images.push({ image: images.pop(), size, amount });
					}
				});
			});
			await ingredient.save({ session });
			await Promise.all(
				this.files.map((val) => val.write()),
				FileService.deleteArray(oldImages, session)
			);
		});
	}

	static async delete(_id, user) {
		const session = await mongoose.startSession();
		await session.withTransaction(async (session) => {
			const [result, pizza] = await Promise.all([
				Ingredient.accessibleBy(user.abilities, 'delete').findOneAndDelete({ _id }, { session }),
				Pizza.findOne(
					{
						$or: [
							{ 'crust.ingredient': _id },
							{ 'crust.sizes.layers.sections.allowedIngredients.ingredient': _id },
						],
					},
					'_id',
					{ session, lean: true }
				),
			]);
			if (!result) throw new Exception(errors.ingredient.Not_Found);
			if (pizza) throw new Exception(errors.ingredient.Used_In_Item(pizza._id));
			const fileQuery = [];
			if (result.defaultPicture) fileQuery.push(FileService.delete(result.defaultPicture, session));
			if (result.icon) fileQuery.push(FileService.delete(result.icon, session));
			if (result.images?.length > 0) {
				const imagesId = result.images.map((val) => val.image);
				fileQuery.push(FileService.deleteArray(imagesId, session));
			}
			await Promise.all(fileQuery);
		});
	}

	static async deleteFile(_id, user) {
		const session = await mongoose.startSession();
		await session.withTransaction(async (session) => {
			const query = _.pick(
				{ icon: 1, defaultPicture: 1, images: 1 },
				Ingredient.accessibleFieldsBy(user.abilities, 'update')
			);
			const result = await Ingredient.accessibleBy(user.abilities, 'update').findOneAndUpdate(
				{ _id },
				{ $unset: query },
				{ session }
			);
			if (!result) throw new Exception(errors.ingredient.Not_Found);
			if (!result.defaultPicture && !result.icon) throw new Exception(errors.file.Not_Found);
			await Promise.all([FileService.delete(result.defaultPicture, session), FileService.delete(result.icon, session)]);
		});
	}

	static async getById(_id) {
		const result = await Ingredient.findById(_id).populate({
			path: 'category defaultPicture icon images.image',
			populate: 'icon',
		});
		if (!result) throw new Exception(errors.ingredient.Not_Found);
		return { data: result };
	}
	static async getByCriteria(criteria, { skip, limit, total, view }) {
		const conditions = (() => {
			const result = _.omit(criteria, ['title']);
			if (criteria.title) result['title'] = new RegExp(`^${criteria.title}`, 'i');
			return result;
		})();

		const result = await Ingredient.findAndCount(total, conditions, '-description -defaultPicture -images', {
			skip,
			limit,
			populate: { path: 'category icon', populate: 'icon' },
		});
		return result;
	}
}

module.exports = IngredientService;
