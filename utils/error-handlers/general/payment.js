const codes = require('../codes');
const httpCodes = require('../../constants/httpStatus');
const statusCodes = require('../../constants/statusCodes');

module.exports = {
	//TODO: all of them
	Not_Found: {
		httpStatus: httpCodes.BAD_REQUEST,
		code: codes.payment + statusCodes.Item_Not_Found + '01',
		msg: 'Payment not found.',
	},

	Stripe_Error: (type, message) => ({
		httpStatus: httpCodes.BAD_REQUEST,
		code: codes.payment + statusCodes.Invalid_Operation + '01',
		msg: `${type}: ${message}`,
	}),

	Payment_Invalid_Status: (status, operation) => ({
		httpStatus: httpCodes.BAD_REQUEST,
		code: codes.payment + statusCodes.Invalid_Operation + '02',
		args: { status, operation },
		msg: `Can not "${operation}" for payment with "${status}" status.`,
	}),
};
