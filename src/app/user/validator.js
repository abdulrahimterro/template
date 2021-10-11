const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const { joiSchema, permissions, enums } = require('utils');
const { Branch, Order, Payment, Pizza, Pizza_Ingredient, User, Driver } = enums.Permission;
const _ = require('lodash');
const { mongodb } = require('database');
const { User: UserDB } = mongodb.Models;
const params = { id: Joi.objectId().required() };

const paramId = Joi.object({ params });

const updateProfile = Joi.object({
	body: Joi.object({
		firstName: Joi.string(),
		lastName: Joi.string(),
		phone: joiSchema.common.phone,
		oldPassword: Joi.string().min(8).max(36),
		newPassword: joiSchema.common.password,
		addresses: Joi.array()
			.items({
				country: Joi.string().required(),
				city: Joi.string().required(),
				location: Joi.string().required(),
				latitude: Joi.number().required(),
				longitude: Joi.number().required(),
			})
			.single()
			.min(1),
	}).and('oldPassword', 'newPassword'),
});

const update = Joi.object({
	body: {
		verified: Joi.boolean(),
	},
});

const getByCriteria = (req) => {
	const schema = {
		firstName: Joi.string(),
		lastName: Joi.string(),
		phone: Joi.string(),
		verified: Joi.boolean(),
		country: Joi.string(),
		city: Joi.string(),
	};
	let data = _.pick(schema, UserDB.accessibleFieldsBy(req.user.abilities, 'list'));
	data = { ...data, ...joiSchema.common.getByCriteria() };
	return Joi.object({ query: data });
};

const Actions = {
	Branch: Joi.string().valid(...enums.toArray(Branch.Action)),
	Order: Joi.string().valid(...enums.toArray(Order.Action)),
	Payment: Joi.string().valid(...enums.toArray(Payment.Action)),
	Pizza: Joi.string().valid(...enums.toArray(Pizza.Action)),
	Pizza_Ingredient: Joi.string().valid(...enums.toArray(Pizza_Ingredient.Action)),
	User: Joi.string().valid(...enums.toArray(User.Action)),
	Driver: Joi.string().valid(...enums.toArray(Driver.Action)),
};
const Fields = {
	Branch: Joi.array()
		.items(Joi.string().valid(...enums.toArray(Branch.Fields)))
		.unique()
		.min(1),
	Order: Joi.array()
		.items(Joi.string().valid(...enums.toArray(Order.Fields)))
		.unique()
		.min(1),
	Payment: Joi.array()
		.items(Joi.string().valid(...enums.toArray(Payment.Fields)))
		.unique()
		.min(1),
	Pizza: Joi.array()
		.items(Joi.string().valid(...enums.toArray(Pizza.Fields)))
		.unique()
		.min(1),
	Pizza_Ingredient: Joi.array()
		.items(Joi.string().valid(...enums.toArray(Pizza_Ingredient.Fields)))
		.unique()
		.min(1),
	User: Joi.array()
		.items(Joi.string().valid(...enums.toArray(User.Fields)))
		.unique()
		.min(1),
	Driver: Joi.array()
		.items(Joi.string().valid(...enums.toArray(Driver.Fields)))
		.unique()
		.min(1),
};
const resource = Joi.array().items(Joi.objectId()).unique().min(1);

const grantPermissions = Joi.object({
	params,
	body: Joi.object({
		subject: Joi.string()
			.valid(...enums.toArray(enums.subjects))
			.required(),
		action: Joi.when('subject', {
			switch: [
				{ is: enums.Permission.Branch.Name, then: Actions.Branch.required() },
				{ is: enums.Permission.Order.Name, then: Actions.Order.required() },
				{ is: enums.Permission.Payment.Name, then: Actions.Payment.required() },
				{ is: enums.Permission.Pizza.Name, then: Actions.Pizza.required() },
				{ is: enums.Permission.Pizza_Ingredient.Name, then: Actions.Pizza_Ingredient.required() },
				{ is: enums.Permission.User.Name, then: Actions.User.required() },
				{ is: enums.Permission.Driver.Name, then: Actions.Driver.required() },
			],
		}),
		fields: Joi.when('subject', {
			switch: [
				{ is: enums.Permission.Branch.Name, then: Fields.Branch },
				{ is: enums.Permission.Order.Name, then: Fields.Order },
				{ is: enums.Permission.Payment.Name, then: Fields.Payment },
				{ is: enums.Permission.Pizza.Name, then: Fields.Pizza },
				{ is: enums.Permission.Pizza_Ingredient.Name, then: Fields.Pizza_Ingredient },
				{ is: enums.Permission.User.Name, then: Fields.User },
				{ is: enums.Permission.Driver.Name, then: Fields.Driver },
			],
		}),
		resource,
	}),
});

const revokePermissions = Joi.object({
	params,
	body: Joi.object({
		subject: Joi.string()
			.valid(...enums.toArray(enums.subjects))
			.required(),
		action: Joi.when('subject', {
			switch: [
				{ is: enums.Permission.Branch.Name, then: Actions.Branch },
				{ is: enums.Permission.Order.Name, then: Actions.Order },
				{ is: enums.Permission.Payment.Name, then: Actions.Payment },
				{ is: enums.Permission.Pizza.Name, then: Actions.Pizza },
				{ is: enums.Permission.Pizza_Ingredient.Name, then: Actions.Pizza_Ingredient },
				{ is: enums.Permission.User.Name, then: Actions.User },
				{ is: enums.Permission.Driver.Name, then: Actions.Driver },
			],
		}),
		fields: Joi.when('subject', {
			switch: [
				{ is: enums.Permission.Branch.Name, then: Fields.Branch },
				{ is: enums.Permission.Order.Name, then: Fields.Order },
				{ is: enums.Permission.Payment.Name, then: Fields.Payment },
				{ is: enums.Permission.Pizza.Name, then: Fields.Pizza },
				{ is: enums.Permission.Pizza_Ingredient.Name, then: Fields.Pizza_Ingredient },
				{ is: enums.Permission.User.Name, then: Fields.User },
				{ is: enums.Permission.Driver.Name, then: Fields.Driver },
			],
		}),
		resource,
	}),
});

module.exports = {
	paramId: joiSchema.validate(paramId),
	update: joiSchema.validate(update),
	updateProfile: joiSchema.validate(updateProfile),
	getByCriteria: joiSchema.validate(getByCriteria),
	grantPermissions: joiSchema.validate(grantPermissions),
	revokePermissions: joiSchema.validate(revokePermissions),
};
