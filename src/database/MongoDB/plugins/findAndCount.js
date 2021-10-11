const {
	commonConstant: {
		pagination: { defaultLimit, defaultSkip, defaultTotal },
	},
} = require('utils');

module.exports = function (schema, options) {
	schema.statics.findAndCount = async function (
		total = defaultTotal,
		criteria = {},
		projection = [],
		options = { limit: defaultLimit, skip: defaultSkip }
	) {
		const result = [];

		result.push(this.find(criteria, projection, options));
		if (total) result.push(this.countDocuments(criteria).session(options.session));

		const [data, count] = await Promise.all(result);
		return { total: count, data: data };
	};
};
