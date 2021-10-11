const { httpStatus, getPagination } = require('utils');
const Ingredient = require('./service');

module.exports = {
	async save(req, res) {
		const { body: data, files } = req;
		const result = await new Ingredient(data, files).save();
		res.status(httpStatus.CREATED).send(result);
	},

	async update(req, res) {
		const { body: data, files, user } = req;
		const { id } = req.params;
		await new Ingredient(data, files).update(id, user);
		res.sendStatus(httpStatus.UPDATED);
	},

	async updateFile(req, res) {
		const { id } = req.params;
		const { files, user } = req;
		const { body: data } = req;
		await new Ingredient(data, files).updateFile(id, user);
		res.sendStatus(httpStatus.UPDATED);
	},

	async delete(req, res) {
		const { user } = req;
		const { id } = req.params;
		await Ingredient.delete(id, user);
		res.sendStatus(httpStatus.DELETED);
	},

	async deleteFile(req, res) {
		const { user } = req;
		const { id } = req.params;
		await Ingredient.deleteFile(id, user);
		res.sendStatus(httpStatus.DELETED);
	},

	async getById(req, res) {
		const { id } = req.params;
		const result = await Ingredient.getById(id);
		res.status(httpStatus.OK).send(result);
	},

	async getByCriteria(req, res) {
		const { criteria, pagination } = getPagination(req.query);
		const result = await Ingredient.getByCriteria(criteria, pagination);
		res.status(httpStatus.OK).send(result);
	},
};
