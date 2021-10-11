const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const defaultOptions = require('../../utils/defaultOptions');

const Address = new Schema(
	{
		country: { type: String, required: true },
		city: { type: String, required: true },
		location: { type: String },
		latitude: { type: Number },
		longitude: { type: Number },
	},
	defaultOptions({ _id: false, timestamps: false })
);

module.exports = Address;
