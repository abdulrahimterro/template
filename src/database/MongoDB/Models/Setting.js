const { App } = require('config-keys');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const defaultOptions = require('../utils/defaultOptions');

const Setting = new Schema(
	{
		appName: { type: String, default: App.name },
	},
	defaultOptions({ timestamps: false })
);

module.exports = mongoose.model('Setting', Setting, 'Setting');
