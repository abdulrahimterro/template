const codes = require('../codes');
const httpCodes = require('../../constants/httpStatus');
const statusCodes = require('../../constants/statusCodes');

module.exports = {
	Not_Found: {
		httpStatus: httpCodes.BAD_REQUEST,
		code: codes.user + statusCodes.Item_Not_Found + '01',
		msg: 'User not found.',
	},
	Update_SuperAdmin: {
		httpStatus: httpCodes.BAD_REQUEST,
		code: codes.user + statusCodes.Invalid_Operation + '02',
		msg: 'Cannot update superAdmin permission.',
	},
	Permission_Grant: {
		httpStatus: httpCodes.BAD_REQUEST,
		code: codes.user + statusCodes.Invalid_Credential + '03',
		msg: 'Invalid grant permissions.',
	},
	Permission_Revoke: {
		httpStatus: httpCodes.BAD_REQUEST,
		code: codes.user + statusCodes.Invalid_Credential + '04',
		msg: 'Invalid revoke permissions.',
	},
	Type_Not_Authorized: {
		httpStatus: httpCodes.BAD_REQUEST,
		code: codes.user + statusCodes.Invalid_Credential + '04',
		msg: 'User type is not authorized.',
	},
};
