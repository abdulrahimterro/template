const { OK } = require('../constants/httpStatus');
const { SUCCESS } = require('../constants/statusCodes');

module.exports = (res, data = { responseData: {}, httpCode: OK, responseStatus: SUCCESS }) =>
	res.status(data.httpCode ?? OK).json({
		status: data.responseStatus ?? SUCCESS,
		response: data.responseData ?? {
			total: undefined,
			data: undefined,
		},
	});
