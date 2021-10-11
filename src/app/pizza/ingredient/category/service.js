const { mongodb } = require('database');
const { Exception, errors, commonConstant } = require('utils');
const { Pizza_IngredientCategory: IngredientCategory } = mongodb.Models;

class IngredientCategoryService {
	static refPath = commonConstant.refPath.IngredientCategory;
	constructor() {}

	static async getById(_id) {
		const result = await IngredientCategory.findById(_id).populate('icon');
		if (!result) throw new Exception(errors.category.Not_Found);
		return { data: result };
	}

	static async getByCriteria() {
		const categories = await IngredientCategory.find().populate('icon');
		const result = categories.reduce((pre, cur) => {
			(pre[cur['parent']] = pre[cur['parent']] || []).push(cur);
			return pre;
		}, {});

		return result;
	}
}

module.exports = IngredientCategoryService;
