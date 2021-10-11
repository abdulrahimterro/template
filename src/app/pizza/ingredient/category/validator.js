const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const { joiSchema, enums } = require('utils');

const paramId = Joi.object({ id: Joi.objectId().required() });

module.exports = {
	paramId: joiSchema.validate(paramId),
};
