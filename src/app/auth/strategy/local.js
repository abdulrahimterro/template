const { Strategy } = require('passport-custom');
const User = require('database').mongodb.Models.User;
const _ = require('lodash');
const { Exception, errors } = require('utils');

const errorMissingEmailOrPhone = new Exception(errors.auth.Invalid_Auth_Email_Password);
const errorEmail = new Exception(errors.auth.Invalid_Auth_Email_Password);
const errorPhone = new Exception(errors.auth.Invalid_Auth_Phone_Password);

module.exports = new Strategy(async ({ body }, done) => {
	const { email, phone, password } = body;
	const criteria = _.pick(body, ['email', 'phone']);
	if (criteria.email) criteria.email = new RegExp(`${criteria.email}`, 'i');
	if (!((email && password) || (phone && password) || phone)) return done(errorMissingEmailOrPhone);

	const doc = await User.findOne(criteria, ['email', 'phone', 'password']).catch((err) => done(err));
	if (!doc) {
		if (email) return done(errorEmail);
		else return done(errorPhone);
	}

	if ((email && password) || (phone && password))
		if ((await doc.verifyPassword(password)) !== true)
			if (email) return done(errorEmail);
			else return done(errorPhone);

	const user = { ..._.pick(doc, ['id', 'email', 'phone']), authentic: password ? true : false };
	done(null, user);
});
