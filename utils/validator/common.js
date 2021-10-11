const { pagination } = require('../constants/common');
const enums = require('../constants/enums');
const Joi = require('joi');
const { parsePhoneNumberWithError } = require('libphonenumber-js');

module.exports = {
	getByCriteria: (req) => {
		const result = {
			skip: Joi.number().integer().min(0).default(pagination.defaultSkip),
			limit: Joi.number().integer().min(1).max(1000).default(pagination.defaultLimit),
			total: Joi.boolean().default(pagination.defaultTotal),
		};
		if (req?.user) result.view = Joi.string().valid(...enums.toArray(enums.General.View));
		return result;
	},

	phone: Joi.string().custom((value, helper) => {
		try {
			parsePhoneNumberWithError(value);
			return value;
		} catch (e) {
			return helper.message(`body.phone must be a valid phone(${e.message})`);
		}
	}),

	password: Joi.string().regex(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*?&])[A-Za-z0-9@$!%*?&]{8,36}$')),
};
