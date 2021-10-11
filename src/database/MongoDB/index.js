const mongoose = require('mongoose');
const { findAndCount, aggregateAndCount } = require('./plugins');
const { accessibleRecordsPlugin, accessibleFieldsPlugin } = require('@casl/mongoose');
const {
	database: { mongodb },
} = require('config-keys');
const mongooseLeanVirtuals = require('mongoose-lean-virtuals');
const mongooseLeanGetters = require('mongoose-lean-getters');
const mongooseAutoPopulate = require('mongoose-autopopulate');

mongoose.plugin(accessibleRecordsPlugin);
mongoose.plugin(accessibleFieldsPlugin);
mongoose.plugin(mongooseLeanVirtuals);
mongoose.plugin(mongooseLeanGetters);
mongoose.plugin(mongooseAutoPopulate);
mongoose.plugin(findAndCount);
mongoose.plugin(aggregateAndCount);

mongoose.set('debug', mongodb.debug);
module.exports = {
	connection: mongoose.connect(mongodb.uri, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		bufferCommands: false,
		useCreateIndex: true,
		useFindAndModify: false,
		dbName: mongodb.dbName,
	}),
	Models: require('./Models'),
	utils: require('./utils'),
};
