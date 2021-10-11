const codes = require('../codes');
const httpCodes = require('../../constants/httpStatus');
const statusCodes = require('../../constants/statusCodes');

module.exports = {
	Not_Found: {
		httpStatus: httpCodes.BAD_REQUEST,
		code: codes.pizza + statusCodes.Item_Not_Found + '01',
		msg: 'Pizza not found.',
	},
	Crust_Not_Found: {
		httpStatus: httpCodes.BAD_REQUEST,
		code: codes.pizza + statusCodes.Item_Not_Found + '02',
		msg: 'Pizza crust not found.',
	},
	Crust_Size_Not_Found: {
		httpStatus: httpCodes.BAD_REQUEST,
		code: codes.pizza + statusCodes.Item_Not_Found + '03',
		msg: 'Pizza crust size not found.',
	},
	Section_Category_Not_Found: {
		httpStatus: httpCodes.BAD_REQUEST,
		code: codes.pizza + statusCodes.Invalid_Operation + '04',
		msg: 'Section category not found.',
	},

	Crust_Default_No_Size: {
		httpStatus: httpCodes.BAD_REQUEST,
		code: codes.pizza + statusCodes.Item_Not_Found + '05',
		msg: 'Default crust must have exactly one default size',
	},
	Default_Section_No_Ingredient: {
		httpStatus: httpCodes.BAD_REQUEST,
		code: codes.pizza + statusCodes.Invalid_Operation + '06',
		msg: 'Default sections must have one or more default ingredient.',
	},
	Default_Size_No_Layer: {
		httpStatus: httpCodes.BAD_REQUEST,
		code: codes.pizza + statusCodes.Item_Not_Found + '07',
		msg: 'Default size must have one or more required layer',
	},
	Default_Layer_No_Sections: {
		httpStatus: httpCodes.BAD_REQUEST,
		code: codes.pizza + statusCodes.Invalid_Operation + '08',
		msg: 'Default layers must have one or more default sections',
	},

	Default_Ingredient_Exceeded: {
		httpStatus: httpCodes.BAD_REQUEST,
		code: codes.pizza + statusCodes.Invalid_Operation + '09',
		msg: 'Sections default ingredient exceeded maxAllowedIngredient.',
	},
	Default_Section_Exceeded: {
		httpStatus: httpCodes.BAD_REQUEST,
		code: codes.pizza + statusCodes.Invalid_Operation + '010',
		msg: 'Layer default Section exceeded maxAllowedIngredient',
	},

	Crust_In_AllowedIngredient: {
		httpStatus: httpCodes.BAD_REQUEST,
		code: codes.pizza + statusCodes.Item_Not_Found + '11',
		msg: 'Cant use crust ingredient in allowedIngredients.',
	},
	Crust_Not_valid: {
		httpStatus: httpCodes.BAD_REQUEST,
		code: codes.pizza + statusCodes.Item_Not_Found + '12',
		msg: 'crust is not valid.',
	},
	Section_Ingredient_Not_Same_Category: (layer, section, item) => ({
		httpStatus: httpCodes.BAD_REQUEST,
		code: codes.pizza + statusCodes.Invalid_Operation + '13',
		msg: 'Section and ingredient must have same category',
		args: { item, layer, section },
	}),

	Crust_Price_Precision: {
		httpStatus: httpCodes.BAD_REQUEST,
		code: codes.pizza + statusCodes.Item_Not_Found + '14',
		msg: 'crust price must not have more than 2 decimal point.',
	},
	Ingredient_Price_Precision: {
		httpStatus: httpCodes.BAD_REQUEST,
		code: codes.pizza + statusCodes.Item_Not_Found + '15',
		msg: 'crust price must not have more than 2 decimal point.',
	},
};
