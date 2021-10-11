const { httpStatus, getPagination } = require('utils');
const User = require('./service');
const { enums } = require('utils');
const params = enums.User;

module.exports = {
	async updateProfile(req, res) {
		const { user, body: data, files } = req;
		await new User(data, files).updateProfile(user);
		res.sendStatus(httpStatus.UPDATED);
	},

	async update(req, res) {
		const { user, body: data } = req;
		const { id } = req.params;
		await new User(data).update(user, id);
		res.sendStatus(httpStatus.UPDATED);
	},

	async updateFile(req, res) {
		const { user, body: data } = req;
		await new User(data).updateFile(user);
		res.sendStatus(httpStatus.UPDATED);
	},

	async getPermissions(req, res) {
		const { user } = req;
		const result = await User.getPermissions(user);
		res.status(httpStatus.OK).send(result);
	},

	async grantPermissions(req, res) {
		const { user, body: data } = req;
		const { id } = req.params;
		await User.grantPermissions(user, id, data);
		res.sendStatus(httpStatus.UPDATED);
	},

	async revokePermissions(req, res) {
		const { user, body: data } = req;
		const { id } = req.params;
		await User.revokePermissions(user, id, data);
		res.sendStatus(httpStatus.UPDATED);
	},

	async getCurrentUser(req, res) {
		const { user } = req;
		const result = await User.getCurrentUser(user);
		res.status(httpStatus.CREATED).send(result);
	},

	getParams(req, res) {
		const result = {};
		Object.keys(params)
			.filter((val) => typeof Object.values(params[val])[0] !== 'object')
			.forEach((val) => (result[val] = enums.toArray(params[val])));
		res.status(httpStatus.OK).json({ data: result });
	},

	async getById(req, res) {
		const { user } = req;
		const { id } = req.params;
		const result = await User.getById(user, id);
		res.status(httpStatus.OK).send(result);
	},

	async getByCriteria(req, res) {
		const { user } = req;
		const { criteria, pagination } = getPagination(req.query);
		const result = await User.getByCriteria(user, criteria, pagination);
		res.status(httpStatus.OK).send(result);
	},
};
