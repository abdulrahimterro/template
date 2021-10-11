const { Exception, errors } = require('../../error-handlers');

/**
 *
 * @param {Array} permissions Array
 * @returns
 */
module.exports =
	(permissions = []) =>
	(req, res, next) => {
		if (!req.user) return next();
		permissions.forEach((val) => {
			if (req.user.permissions.some((code) => val.parent.includes(code))) return;
			if (req.user.permissions.includes(val.code)) return;
			throw new Exception(errors.auth.Invalid_Permissions);
		});
		next();
	};
