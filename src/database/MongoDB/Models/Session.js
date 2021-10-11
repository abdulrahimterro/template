const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const defaultOptions = require('../utils/defaultOptions');

const SessionSchema = new Schema(
	{
		token: { type: String, required: true },
		user: { type: Schema.ObjectId, required: true, refPath: 'User' },
		createdAt: { type: Date, default: new Date() },
	},
	defaultOptions({ timestamps: false })
);

module.exports = mongoose.model('Session', SessionSchema, 'Session');
