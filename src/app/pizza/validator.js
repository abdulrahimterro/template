const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const { joiSchema, enums } = require('utils');
const _ = require('lodash');
const { mongodb } = require('database');
const { Pizza, Branch } = mongodb.Models;
// when ordering price canot be 0
const params = { id: Joi.objectId().required() };

const paramId = Joi.object({ params });

const amounts = Joi.array()
	.items({
		value: Joi.string()
			.valid(...enums.toArray(enums.pizza.amount.basic))
			.required(),
		default: Joi.boolean(),
		full: Joi.number().when('default', { is: true, then: Joi.valid(0) }),
		half: Joi.number(),
	})
	.unique('value');

const allowedIngredients = Joi.array().items(
	Joi.object({
		ingredient: Joi.objectId().required(),
		default: Joi.boolean(),
		full: Joi.number(),
		half: Joi.number(),
		amounts: amounts,
	})
		.nand('amounts', 'full')
		.nand('amounts', 'half')
);

const section = {
	required: Joi.boolean(),
	maxAllowedIngredient: Joi.number().min(0).max(100),
	allowedIngredients: allowedIngredients.required(),
};

const layers = Joi.array()
	.items({
		category: Joi.string().valid(...enums.toArray(enums.pizza.ingredientCategory.category)),
		required: Joi.boolean(),
		maxAllowedIngredient: Joi.number().min(0).max(100),
		sections: Joi.when('category', {
			is: 'basic',
			then: Joi.array()
				.items({
					category: Joi.string()
						.valid(...enums.toArray(_.omit(enums.pizza.ingredientCategory.basic, 'crust')))
						.required(),
					...section,
				})
				.unique('category')
				.required(),
		}).when('category', {
			is: 'toppings',
			then: Joi.array()
				.items({
					category: Joi.string()
						.valid(...enums.toArray(enums.pizza.ingredientCategory.toppings))
						.required(),
					...section,
				})
				.unique('category')
				.required(),
		}),
	})
	.unique('category');

const sizes = Joi.array()
	.items({
		value: Joi.string()
			.valid(...enums.toArray(enums.pizza.size.value))
			.required(),
		default: Joi.boolean(),
		price: Joi.number().required(),
		layers: layers.required(),
	})
	.unique('value');

const crust = Joi.array()
	.items({
		ingredient: Joi.objectId().required(),
		default: Joi.boolean(),
		sizes: sizes.required(),
		layer: Joi.string(),
		section: Joi.string(),
	})
	.unique('ingredient');

const schema = {
	category: Joi.string()
		.required()
		.valid(...enums.toArray(enums.pizza.pizzaCategory))
		.required(),
	title: Joi.string().required(),
	subtitle: Joi.string(),
	description: Joi.string(),
	includeTax: Joi.boolean(),
	discount: Joi.number().min(0).max(1),
	crust: crust.required(),
};

const save = Joi.object({ body: schema });
const update = Joi.object({ params, body: schema });

const getByCriteria = Joi.object({
	query: {
		...joiSchema.common.getByCriteria(),
		category: Joi.string().valid(...enums.toArray(enums.pizza.pizzaCategory)),
		title: Joi.string(),
	},
});

module.exports = {
	save: joiSchema.validate(save),
	update: joiSchema.validate(update),
	paramId: joiSchema.validate(paramId),
	getByCriteria: joiSchema.validate(getByCriteria),
};
