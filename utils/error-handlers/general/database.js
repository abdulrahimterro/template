const codes = require('../codes');
const httpCodes = require('../../constants/httpStatus');
const statusCodes = require('../../constants/statusCodes');

module.exports = {
	Database_Conflict: {
		httpStatus: httpCodes.BAD_REQUEST,
		code: codes.database + statusCodes.Invalid_Operation + '01',
		msg: 'Conflict.',
	},
	Database_Constraint: {
		httpStatus: httpCodes.BAD_REQUEST,
		code: codes.database + statusCodes.Invalid_Operation + '02',
		msg: 'Reference non existing data.',
	},
};
