const { httpStatus } = require('utils');
const Authentication = require('./service');

module.exports = {
	signUp: async (req, res) => {
		const { body: data } = req;
		const result = await Authentication.signUp(data);
		res.status(httpStatus.CREATED).json(result);
	},

	login: async (req, res) => {
		const { body: data } = req;
		const result = await Authentication.login(data);
		res.status(httpStatus.OK).json(result);
	},

	verify: async (req, res) => {
		const { user, body: data } = req;
		await Authentication.verify(user, data);
		res.sendStatus(httpStatus.OK);
	},

	resendVerification: async (req, res) => {
		const { user, body: data } = req;
		await Authentication.resendVerification(user, data);
		res.sendStatus(httpStatus.OK);
	},

	refreshToken: async (req, res) => {
		const { body: data } = req;
		const result = await Authentication.refreshToken(data);
		res.status(httpStatus.UPDATED).json(result);
	},
};
