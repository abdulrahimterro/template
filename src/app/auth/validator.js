const Joi = require('joi');
const { joiSchema, enums } = require('utils');
const { User } = enums;
const _ = require('lodash');
const phone = joiSchema.common.phone.required();

const password = joiSchema.common.password;

const login = Joi.object({
	body: Joi.object({
		phone,
		password,
		token: Joi.string(),
		code: Joi.string(),
	})
		.nand('password', 'code')
		.and('token', 'code'),
});

const verify = Joi.object({
	body: { phone, code: Joi.string().required() },
});

const resendVerification = Joi.object({ body: { phone } });

const signUp = Joi.object({
	body: {
		phone,
		password: password.required(),
		firstName: Joi.string().required(),
		lastName: Joi.string().required(),
		address: {
			country: Joi.string().required(),
			city: Joi.string().required(),
			location: Joi.string(),
			latitude: Joi.number(),
			longitude: Joi.number(),
		},
		type: Joi.string()
			.valid(...enums.toArray(_.omit(User.Types, ['Driver'])))
			.required(),
	},
});

const refreshToken = Joi.object({
	body: { token: Joi.string().required() },
});

module.exports = {
	login: joiSchema.validate(login),
	verify: joiSchema.validate(verify),
	resendVerification: joiSchema.validate(resendVerification),
	signUp: joiSchema.validate(signUp),
	refreshToken: joiSchema.validate(refreshToken),
};
