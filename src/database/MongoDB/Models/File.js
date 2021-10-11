const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const defaultOptions = require('../utils/defaultOptions');
const {
	server: { domain },
	assetsPath,
} = require('config-keys');

const File = new Schema(
	{
		name: { type: String, required: true, select: false },
		size: { type: Number, required: true, select: false },
		mimeType: { type: String, required: true, select: false },
		uri: { type: String, required: true },
		isPrivate: { type: Boolean, required: true, default: false },
	},
	defaultOptions({ hide: ['uri', 'isPrivate'] })
);

File.virtual('url').get(function () {
	const assetsPrefix = this.isPrivate ? assetsPath.private : assetsPath.public;
	const prefix = domain + '/' + assetsPrefix;
	return prefix + this.uri;
});

module.exports = mongoose.model('File', File, 'File');
