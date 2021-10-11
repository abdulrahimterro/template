const httpStatusCode = require('../constants/httpStatus');
const errors = require('./errors');

class Exception {
	constructor({ httpStatus, code, msg, args = {} }) {
		this.httpStatus = httpStatus;
		this.code = code;
		this.message = msg;
		this.args = args;
	}

	static defaultHandler(err) {
		console.error(err);
		process.exit(1);
	}

	static handler(err, req, res, next) {
		let httpStatus = err.httpStatus || httpStatusCode.INTERNAL_SERVER_ERROR;
		let code = err.code || httpStatusCode.INTERNAL_SERVER_ERROR;
		let message = err.code ? err.message : 'Internal server error.';
		let args = err.args;

		//JSON parse errors
		if (err.type == 'entity.parse.failed') {
			httpStatus = httpStatusCode.BAD_REQUEST;
			code = httpStatusCode.BAD_REQUEST;
			message = 'JSON parsing error.';
		}

		// Database errors
		if (err.name == 'SequelizeUniqueConstraintError') {
			httpStatus = errors.database.Database_Conflict.httpStatus;
			code = errors.database.Database_Conflict.code;
			message = errors.database.Database_Conflict.msg;
		}

		if (err.name == 'SequelizeForeignKeyConstraintError') {
			httpStatus = errors.database.Database_Constraint.httpStatus;
			code = errors.database.Database_Constraint.code;
			message = errors.database.Database_Constraint.msg;
		}

		// JWT errors
		if (err.name == 'TokenExpiredError') {
			httpStatus = errors.auth.Token_Expired.httpStatus;
			code = errors.auth.Token_Expired.code;
			message = errors.auth.Token_Expired.msg;
		}

		if (err.name == 'JsonWebTokenError') {
			httpStatus = errors.auth.Invalid_Auth_Token.httpStatus;
			code = errors.auth.Invalid_Auth_Token.code;
			message = errors.auth.Invalid_Auth_Token.msg;
		}

		// Multer errors
		if (err.message === 'Multipart: Boundary not found') {
			httpStatus = errors.multer.Boundary_Not_Found.httpStatus;
			code = errors.multer.Boundary_Not_Found.code;
			message = errors.multer.Boundary_Not_Found.msg;
		}

		if (err.name === 'MulterError') {
			httpStatus = errors.multer.File_Upload_Failed.httpStatus;
			code = errors.multer.File_Upload_Failed.code;
			message = errors.multer.File_Upload_Failed.msg;

			if (err.message === 'File too large') {
				httpStatus = errors.multer.Large_File_Size.httpStatus;
				code = errors.multer.Large_File_Size.code;
				message = errors.multer.Large_File_Size.msg;
			}

			if (err.code === 'LIMIT_FILE_COUNT') {
				httpStatus = errors.multer.Too_Many_Files.httpStatus;
				code = errors.multer.Too_Many_Files.code;
				message = errors.multer.Too_Many_Files.msg;
			}
		}

		if (httpStatus == 500) console.error(err);
		if (!res.headersSent) res.status(httpStatus).json({ code, message, args });
	}
}

module.exports = Exception;
