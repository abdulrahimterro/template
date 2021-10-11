const { Root, Admin } = require('../access/permissions').codes;
/**
 *
 * @param {Object} user user object
 * @param {Array} permissions array of permissions objects
 * @returns
 */
module.exports = (user, key, permissions = []) => {
	if (!user) return {};

	const allowedPermissions = [Root.code, Admin.code];
	permissions.forEach((val) => allowedPermissions.push(val.code));

	const result = {};
	if (user.permissions.some((val) => allowedPermissions.includes(val))) return result;

	result[key] = user._id;
	return result;
};
