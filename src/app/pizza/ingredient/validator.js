const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const { joiSchema, enums } = require('utils');
const { mongodb } = require('database');
const { Pizza_Ingredient } = mongodb.Models;
const _ = require('lodash');
const params = { id: Joi.objectId().required() };

const paramId = Joi.object({ params });

const save = Joi.object({
	body: {
		category: Joi.objectId().required(),
		title: Joi.string().required(),
		description: Joi.string(),
	},
});

const update = (req) => {
	const schema = {
		category: Joi.objectId(),
		title: Joi.string(),
		description: Joi.string(),
	};
	const fields = Pizza_Ingredient.accessibleFieldsBy(req.user.abilities, 'update');
	req.files = _.pick(req.files, fields);
	const data = _.pick(schema, fields);
	return Joi.object({ params, body: data });
};

const updateFile = Joi.object({
	params,
	body: {
		amounts: Joi.array()
			.items(Joi.valid(...enums.toArray(enums.pizza.amount.basic)))
			.unique()
			.min(1)
			.max(3),
		sizes: Joi.array()
			.items(Joi.valid(...enums.toArray(enums.pizza.size.value)))
			.unique()
			.min(1)
			.max(3),
	},
});

const getByCriteria = Joi.object({
	query: {
		...joiSchema.common.getByCriteria(),
		category: Joi.objectId(),
		title: Joi.string(),
	},
});

module.exports = {
	save: joiSchema.validate(save),
	update: joiSchema.validate(update),
	updateFile: joiSchema.validate(updateFile),
	paramId: joiSchema.validate(paramId),
	getByCriteria: joiSchema.validate(getByCriteria),
};
