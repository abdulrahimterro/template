const codes = require('../codes');
const httpCodes = require('../../constants/httpStatus');
const statusCodes = require('../../constants/statusCodes');

module.exports = {
	Not_Found: {
		httpStatus: httpCodes.BAD_REQUEST,
		code: codes.branch + statusCodes.Item_Not_Found + '01',
		msg: 'Branch not found.',
	},
	Delete_Last_Branch: {
		httpStatus: httpCodes.BAD_REQUEST,
		code: codes.branch + statusCodes.Item_Not_Found + '02',
		msg: 'Cant delete Last Branch.',
	},
	Branch_Closed: {
		httpStatus: httpCodes.BAD_REQUEST,
		code: codes.branch + statusCodes.Item_Not_Found + '03',
		msg: 'Branch is closed.',
	},
};
