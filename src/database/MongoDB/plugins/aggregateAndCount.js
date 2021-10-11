const {
	commonConstant: {
		pagination: { defaultLimit, defaultSkip, defaultTotal },
	},
} = require('utils');
module.exports = function (schema, options) {
	schema.statics.aggregateAndCount = async function (total, query, { skip, limit }) {
		const queries = [];

		queries.push(this.aggregate([...query, { $skip: skip }, { $limit: limit }]));
		if (total) queries.push(this.aggregate([...query, { $count: 'total' }]));

		const [data, count] = await Promise.all(queries);
		const result = {};
		if (total) result.total = count[0].total;
		result.data = data;
		return result;
	};
};
