const { INTERNAL_SERVER_ERROR } = require('../constants/httpStatus');
const { GENERAL_ERROR } = require('../constants/statusCodes');

module.exports = (res, { errors = [], httpStatus = INTERNAL_SERVER_ERROR, responseStatus = GENERAL_ERROR }) =>
	res.status(httpStatus).json({ status: responseStatus, errors });
