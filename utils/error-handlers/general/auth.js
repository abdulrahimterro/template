const codes = require('../codes');
const httpCodes = require('../../constants/httpStatus');
const statusCodes = require('../../constants/statusCodes');

module.exports = {
	Token_Expired: {
		httpStatus: httpCodes.UNAUTHORIZED,
		code: codes.auth + statusCodes.Invalid_Operation + '01',
		msg: 'Authorization Token expired.',
	},
	Invalid_Auth_Token: {
		httpStatus: httpCodes.UNAUTHORIZED,
		code: codes.auth + statusCodes.Invalid_Operation + '02',
		msg: 'Invalid authorization token.',
	},
	Invalid_Auth_Email_Password: {
		httpStatus: httpCodes.UNAUTHORIZED,
		code: codes.auth + statusCodes.Invalid_Operation + '03',
		msg: 'Invalid authorization email or password.',
	},
	Invalid_Auth_Phone_Password: {
		httpStatus: httpCodes.UNAUTHORIZED,
		code: codes.auth + statusCodes.Invalid_Operation + '04',
		msg: 'Invalid authorization phone or password.',
	},
	Invalid_Auth: {
		httpStatus: httpCodes.UNAUTHORIZED,
		code: codes.auth + statusCodes.Invalid_Operation + '05',
		msg: 'Invalid authorization.',
	},
	Invalid_Auth_Verify_Code: {
		httpStatus: httpCodes.UNAUTHORIZED,
		code: codes.auth + statusCodes.Invalid_Operation + '06',
		msg: 'Invalid verification code.',
	},
	Account_Already_Verified: {
		httpStatus: httpCodes.UNAUTHORIZED,
		code: codes.auth + statusCodes.Invalid_Operation + '07',
		msg: 'Account already verified.',
	},
	Invalid_Auth_Code_Token: {
		httpStatus: httpCodes.UNAUTHORIZED,
		code: codes.auth + statusCodes.Invalid_Operation + '08',
		msg: 'Invalid authorization code token.',
	},
	Invalid_Auth_Code: {
		httpStatus: httpCodes.UNAUTHORIZED,
		code: codes.auth + statusCodes.Invalid_Operation + '09',
		msg: 'Invalid authorization code.',
	},
	Unauthorized: {
		httpStatus: httpCodes.UNAUTHORIZED,
		code: codes.auth + statusCodes.Invalid_Operation + '10',
		msg: 'Unauthorized.',
	},
	Account_UnVerified: {
		httpStatus: httpCodes.UNAUTHORIZED,
		code: codes.auth + statusCodes.Invalid_Operation + '11',
		msg: 'Account is not verified yet.',
	},
	Invalid_Permissions: {
		httpStatus: httpCodes.FORBIDDEN,
		code: codes.auth + statusCodes.Invalid_Operation + '12',
		msg: "You don't have the permissions to do this request.",
	},
	Invalid_Old_Password: {
		httpStatus: httpCodes.BAD_REQUEST,
		code: codes.auth + statusCodes.Invalid_Operation + '13',
		msg: 'Invalid old password.',
	},
	Resend_Verification_Attempts: (date, waitTime) => ({
		httpStatus: httpCodes.BAD_REQUEST,
		code: codes.auth + statusCodes.Invalid_Operation + '14',
		msg: `You need to wait before next verification attempt.`,
		args: { lastAttempt: date, waitTime },
	}),
};
