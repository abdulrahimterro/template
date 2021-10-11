const { httpStatus, getPagination } = require('utils');
const Pizza = require('./service');

module.exports = {
	async save(req, res) {
		const { body: data } = req;
		const result = await new Pizza(data).save();
		res.status(httpStatus.CREATED).send(result);
	},

	async update(req, res) {
		const { body: data, user } = req;
		const { id } = req.params;
		await new Pizza(data).update(id, user);
		res.sendStatus(httpStatus.UPDATED);
	},

	async delete(req, res) {
		const { user } = req;
		const { id } = req.params;
		await Pizza.delete(id, user);
		res.sendStatus(httpStatus.DELETED);
	},

	async updateFile(req, res) {
		const { files, user } = req;
		const { id } = req.params;
		await new Pizza({}, files).updateFile(id, user);
		res.sendStatus(httpStatus.UPDATED);
	},

	async deleteFile(req, res) {
		const { user } = req;
		const { id } = req.params;
		await Pizza.deleteFile(id, user);
		res.sendStatus(httpStatus.DELETED);
	},

	async getById(req, res) {
		const { user } = req;
		const { id } = req.params;
		const result = await Pizza.getById(id, user);
		res.status(httpStatus.OK).send(result);
	},

	async getByCriteria(req, res) {
		const { user } = req;
		const { criteria, pagination } = getPagination(req.query);
		const result = await Pizza.getByCriteria(criteria, pagination, user);
		res.status(httpStatus.OK).send(result);
	},
};
