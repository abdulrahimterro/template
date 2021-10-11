const { Ability } = require('@casl/ability');
const Exception = require('../../error-handlers/Exception');
const errors = require('../../error-handlers/errors');

module.exports = (action, subject) => (req, res, next) => {
	if (!action && !subject) return next();
	const userAbility = req.user.abilities.map((val) => {
		const result = { action: val.action, subject: val.subject };
		if (val.resources) result.conditions = { [val.resources.key]: { $in: val.resources.resource } };
		if (val.fields.length > 0) result['fields'] = val.fields;
		return result;
	});
	req.user.abilities = new Ability(userAbility);
	if (req.user.abilities.can(action, subject)) return next();
	else throw new Exception(errors.auth.Unauthorized);
};
