const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const defaultOptions = require('../utils/defaultOptions');
const { enums } = require('utils');

const amount = new Schema(
	{
		value: { type: String, enums: enums.pizza.amount.basic, required: true },
		default: { type: Boolean, default: false },
		full: { type: Number },
		half: { type: Number },
	},
	defaultOptions({ _id: false, timestamps: false })
);

const allowedIngredient = new Schema(
	{
		ingredient: { type: Schema.Types.ObjectId, ref: 'Pizza_Ingredient', required: true },
		default: { type: Boolean, default: false },
		full: { type: Number },
		half: { type: Number },
		amounts: { type: [amount], required: true },
	},
	defaultOptions({ _id: false, timestamps: false })
);

const section = new Schema(
	{
		category: {
			type: String,
			enums: [enums.pizza.ingredientCategory.basic, enums.pizza.ingredientCategory.toppings],
			required: true,
		},
		required: { type: Boolean, default: false },
		maxSelectIngredient: { type: Number, default: 0 },
		allowedIngredients: { type: [allowedIngredient], required: true },
	},
	defaultOptions({ _id: false, timestamps: false })
);

const layer = new Schema(
	{
		category: { type: String, enums: enums.pizza.ingredientCategory.category, required: true },
		required: { type: Boolean, default: false },
		maxAllowedIngredient: { type: Number, default: 0 },
		sections: { type: [section], required: true },
	},
	defaultOptions({ _id: false, timestamps: false })
);

const size = new Schema(
	{
		value: { type: String, enums: enums.pizza.size.value, required: true },
		default: { type: Boolean, default: false },
		price: { type: Number, required: true },
		layers: { type: [layer], required: true },
	},
	defaultOptions({ _id: false, timestamps: false })
);

const crust = new Schema(
	{
		ingredient: { type: mongoose.Types.ObjectId, ref: 'Pizza_Ingredient', required: true },
		default: { type: Boolean, default: false },
		layer: { type: String },
		section: { type: String },
		sizes: { type: [size], required: true },
	},
	defaultOptions({ _id: false, timestamps: false })
);

const Pizza = new Schema(
	{
		category: { type: String, enums: enums.pizza.pizzaCategory, required: true },
		title: { type: String, required: true },
		subtitle: { type: String },
		description: { type: String },
		includeTax: { type: Boolean, default: false },
		discount: { type: Number, min: 0, max: 1, default: 0 },
		crust: { type: [crust], required: true },
		images: [{ type: Schema.Types.ObjectId, ref: 'File' }],
	},
	defaultOptions({ timestamps: false })
);

module.exports = mongoose.model('Pizza', Pizza, 'Pizza');
