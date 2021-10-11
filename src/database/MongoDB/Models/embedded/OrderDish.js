const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const defaultOptions = require('../../utils/defaultOptions');
const { enums } = require('utils');
const Categories = {}; //enums.HalalMarket.Dish.Categories;

const OrderDish = new Schema(
	{
		category: { type: String, required: true, enum: enums.toArray(Categories) },
		name: { type: String, required: true },
		description: { type: String, required: true },
		price: { type: Number, required: true, min: 0 },
		discount: { type: Number, min: 0, max: 1, default: 0 },
		image: { type: Schema.Types.ObjectId, ref: 'File' },
	},
	defaultOptions({ _id: false, timestamps: false })
);

module.exports = OrderDish;
