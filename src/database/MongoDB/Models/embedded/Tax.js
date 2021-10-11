const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const defaultOptions = require('../../utils/defaultOptions');

const Tax = new Schema(
	{
		name: { type: String, required: true },
		value: { type: Number, min: 0, max: 1, required: true },
	},
	defaultOptions({ _id: false, timestamps: false })
);

module.exports = Tax;
