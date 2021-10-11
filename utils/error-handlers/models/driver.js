const codes = require('../codes');
const httpCodes = require('../../constants/httpStatus');
const statusCodes = require('../../constants/statusCodes');

module.exports = {
	Not_Found: {
		httpStatus: httpCodes.BAD_REQUEST,
		code: codes.driver + statusCodes.Item_Not_Found + '01',
		msg: 'Driver not found.',
	},
	Max_Order_Deliver: {
		httpStatus: httpCodes.BAD_REQUEST,
		code: codes.order + statusCodes.Invalid_Operation + '01',
		msg: 'Driver exceeded max number of order to deliver',
	},
};
