const codes = require('../codes');
const httpCodes = require('../../constants/httpStatus');
const statusCodes = require('../../constants/statusCodes');

module.exports = {
	Not_Found: {
		httpStatus: httpCodes.BAD_REQUEST,
		code: codes.file + statusCodes.Item_Not_Found + '01',
		msg: 'File not found.',
	},
};
