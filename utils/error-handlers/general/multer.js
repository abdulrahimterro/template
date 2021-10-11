const codes = require('../codes');
const httpCodes = require('../../constants/httpStatus');
const statusCodes = require('../../constants/statusCodes');

module.exports = {
	UnSupported_Media_Type: (type, allowedTypes) => ({
		httpStatus: httpCodes.UNSUPPORTED_MEDIA_TYPE,
		code: codes.multer + statusCodes.Invalid_Operation + '01',
		msg: 'Non supported file type ' + type + ' only support this types[ ' + allowedTypes + ' ].',
	}),
	File_Upload_Failed: {
		httpStatus: httpCodes.BAD_REQUEST,
		code: codes.multer + statusCodes.Invalid_Operation + '02',
		msg: 'Error uploading file.',
	},
	Large_File_Size: {
		httpStatus: httpCodes.BAD_REQUEST,
		code: codes.multer + statusCodes.Invalid_Operation + '03',
		msg: 'File size is too large.',
	},
	Too_Many_Files: {
		httpStatus: httpCodes.BAD_REQUEST,
		code: codes.multer + statusCodes.Invalid_Operation + '04',
		msg: 'Exceeded max files count limit.',
	},
	Boundary_Not_Found: {
		httpStatus: httpCodes.BAD_REQUEST,
		code: codes.multer + statusCodes.Invalid_Operation + '05',
		msg: 'Multipart Header: Boundary not found',
	},
};
