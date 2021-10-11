const { General } = require('../constants/enums');
const _ = require('lodash');

module.exports = (query) => {
	const pagination = _.pick(query, ['skip', 'limit', 'total', 'view']);
	const criteria = _.omit(query, ['skip', 'limit', 'total', 'view']);

	pagination.view = pagination.view ?? General.View.Default;

	return { pagination, criteria };
};
