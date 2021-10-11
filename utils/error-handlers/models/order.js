const codes = require('../codes');
const httpCodes = require('../../constants/httpStatus');
const statusCodes = require('../../constants/statusCodes');

module.exports = {
	Not_Found: {
		httpStatus: httpCodes.BAD_REQUEST,
		code: codes.order + statusCodes.Item_Not_Found + '01',
		msg: 'Order not found.',
	},
	Ingredient_Not_Found: {
		httpStatus: httpCodes.BAD_REQUEST,
		code: codes.order + statusCodes.Item_Not_Found + '02',
		msg: 'Order Ingredient not found in pizza.',
	},
	Ingredient_Amount_Not_Found: {
		httpStatus: httpCodes.BAD_REQUEST,
		code: codes.order + statusCodes.Item_Not_Found + '03',
		msg: 'Order Ingredient with Amount not found in pizza.',
	},
	User_Address_Not_Found: (index) => ({
		httpStatus: httpCodes.BAD_REQUEST,
		code: codes.order + statusCodes.Item_Not_Found + '04',
		msg: `User address not found at index ${index}.`,
	}),

	Empty_Order: {
		httpStatus: httpCodes.BAD_REQUEST,
		code: codes.order + statusCodes.Invalid_Operation + '05',
		msg: 'You must order at least one item or one combo.',
	},

	Branch_Not_Ready: {
		httpStatus: httpCodes.BAD_REQUEST,
		code: codes.order + statusCodes.Invalid_Operation + '06',
		msg: `Branch is not ready to receive orders.`,
	},

	User_Not_Same_Branch_Address: {
		httpStatus: httpCodes.BAD_REQUEST,
		code: codes.order + statusCodes.Item_Not_Found + '07',
		msg: 'User not in the same city of branch.',
	},

	Layer_Required: (item, layer) => ({
		httpStatus: httpCodes.BAD_REQUEST,
		code: codes.order + statusCodes.Invalid_Operation + '08',
		msg: `item ${item} has required layer missing`,
		args: { item },
	}),
	Layer_Ingredient_Number_Exceeded: (item, layer) => ({
		httpStatus: httpCodes.BAD_REQUEST,
		code: codes.order + statusCodes.Invalid_Operation + '09',
		msg: `Layer at index ${layer} for item ${item} exceeded allowed ingredient number.`,
		args: { item, layer },
	}),
	Section_Ingredient_Number_Exceeded: (item, layer) => ({
		httpStatus: httpCodes.BAD_REQUEST,
		code: codes.order + statusCodes.Invalid_Operation + '10',
		msg: `Section in Layer at index ${layer} for item ${item} exceeded allowed ingredient number.`,
		args: { item, layer },
	}),

	Status_Conflict: (currentStatus, newStatus) => ({
		httpStatus: httpCodes.BAD_REQUEST,
		code: codes.order + statusCodes.Invalid_Operation + '11',
		msg: `Can not update status to ${newStatus} if current status is ${currentStatus}.`,
		args: { currentStatus, newStatus },
	}),
	Cancellation: {
		httpStatus: httpCodes.BAD_REQUEST,
		code: codes.order + statusCodes.Invalid_Operation + '12',
		msg: `Can not cancel order after payment or after being accepted by the admin.`,
	},
	No_Driver: {
		httpStatus: httpCodes.BAD_REQUEST,
		code: codes.order + statusCodes.Invalid_Operation + '13',
		msg: 'Can not accept delivery order when no driver available.',
	},
	Driver_TimeOut: {
		httpStatus: httpCodes.BAD_REQUEST,
		code: codes.order + statusCodes.Invalid_Operation + '14',
		msg: 'Driver pickup timeOut for order.',
	},
};
