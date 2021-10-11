const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const defaultOptions = require('../../utils/defaultOptions');
const { enums } = require('utils');
const { status } = enums.Driver;
const User = require('./User');

const DriverSchema = new Schema(
	{
		status: { type: String, enums: status, default: status.Offline },
		orders: [{ type: Schema.Types.ObjectId, ref: 'Order' }],
	},
	defaultOptions()
);

module.exports = User.discriminator('Driver', DriverSchema, 'Driver');
