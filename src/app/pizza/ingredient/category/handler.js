const { httpStatus } = require('utils');
const Category = require('./service');

module.exports = {
	async getById(req, res) {
		const { id } = req.params;
		const result = await Category.getById(id);
		res.status(httpStatus.OK).send(result);
	},

	async getByCriteria(req, res) {
		const result = await Category.getByCriteria();
		res.status(httpStatus.OK).send(result);
	},
};
