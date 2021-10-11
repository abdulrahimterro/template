const { jwt } = require('config-keys');
const { verify } = require('jsonwebtoken');
const { Admin } = require('../access/permissions/permissions');

module.exports = (client, next) => {
	const token = client.handshake?.auth?.token;
	const error = new Error('Unauthorized');
	error.data = { code: 403 };
	if (!token) return next(error);
	verify(token, jwt.accessToken.key, async (err, payload) => {
		if (err) return next(error);
		const { User } = require('database').mongodb.Models;
		const user = await User.findById(payload.id);
		if (!user) return next(error);
		if (user.verified !== true) next(error);
		if (user.permissions.some((code) => Admin.parent.includes(code)) || user.permissions.includes(Admin.code)) {
			client.user = user;
			next();
		} else next(error);
	});
};
