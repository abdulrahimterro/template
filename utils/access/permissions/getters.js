const permissions = require('./permissions');
const _ = require('lodash');

module.exports = {
	// All permissions
	all: Object.keys(permissions).flatMap((key) => permissions[key].code),

	// All default permissions
	defaults: Object.keys(permissions).flatMap((key) =>
		Object.keys(permissions[key])
			.filter((val) => permissions[key][val].default)
			.map((val) => permissions[key][val].code)
	),

	// Default permissions for a specific model
	default: (model) =>
		Object.keys(permissions[model])
			.filter((val) => permissions[model][val].default)
			.map((val) => permissions[model][val].code),

	// All permissions codes of a model
	codes: (model) => Object.keys(permissions[model]).map((val) => permissions[key][val].code),

	parent: (code) => {
		const path = code.split('.').map((val) => val[0].toUpperCase() + val.slice(1));
		return _.get(permissions, path).parent || _.get(permissions, path).Admin.parent;
	},
};
