const codes = require('../codes');
const httpCodes = require('../../constants/httpStatus');
const statusCodes = require('../../constants/statusCodes');

module.exports = {
	Not_Found: {
		httpStatus: httpCodes.BAD_REQUEST,
		code: codes.ingredient + statusCodes.Item_Not_Found + '01',
		msg: 'Ingredient not found.',
	},

	Used_In_Item: (id) => ({
		httpStatus: httpCodes.BAD_REQUEST,
		code: codes.pizza + statusCodes.Item_Not_Found + '02',
		msg: `Ingredient used in pizza ${id} .`,
	}),
};
