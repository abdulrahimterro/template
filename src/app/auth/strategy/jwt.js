const { Strategy } = require('passport-custom');
const jsonwebtoken = require('jsonwebtoken');
const User = require('database').mongodb.Models.User;
const { jwt } = require('config-keys');
const { Exception, errors } = require('utils');

const invalidToken = new Exception(errors.auth.Invalid_Auth_Token);
const tokenExpired = new Exception(errors.auth.Token_Expired);
const unVerified = new Exception(errors.auth.Account_UnVerified);

module.exports = (nonVerified = false) =>
	new Strategy(({ headers }, done) => {
		const token = headers.authorization?.split(' ')[1];
		if (!token) return done(null, false);
		jsonwebtoken.verify(token, jwt.accessToken.key, async (err, payload) => {
			if (err?.name === 'TokenExpiredError') return done(tokenExpired);
			if (err) return done(invalidToken);

			const user = await User.findById(payload.id);
			if (!user) return done(invalidToken);
			if (!nonVerified && user.verified !== true) return done(unVerified);

			done(null, user);
		});
	});
