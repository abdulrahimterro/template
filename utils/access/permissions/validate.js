/**
 *
 * @param {Array} permissions Array
 * @returns
 */
module.exports = (user, permissions = []) => {
	let flag = true;
	permissions.forEach((val) => {
		if (!flag) return;
		if (user.permissions.some((code) => val.parent.includes(code))) return;
		if (user.permissions.includes(val.code)) return;
		flag = false;
	});

	return flag;
};
