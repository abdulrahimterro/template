module.exports = {
	pagination: {
		defaultLimit: 50,
		defaultSkip: 0,
		defaultTotal: false,
		defaultView: 'default',
	},

	refPath: {
		general: { path: 'general' },
		User: {
			path: 'user',
			avatar: { path: 'user/avatar', access: ['public'] },
		},

		Branch: {
			path: 'branch',
			avatar: { path: 'branch/avatar' },
			coverImage: { path: 'branch/coverImage' },
			images: { path: 'branch/images' },
		},

		Pizza: {
			path: 'pizza',
			images: { path: 'pizza/images' },
		},

		Pizza_Ingredient: {
			path: 'Pizza_ingredient',
			icon: { path: 'PizzaIngredient/icon' },
			defaultPicture: { path: 'PizzaIngredient/defaultPicture' },
			images: { path: 'PizzaIngredient/images' },
		},

		Pizza_Ingredient_Category: {
			path: 'PizzaIngredientCategory',
			icon: { path: 'PizzaIngredientCategory/icon' },
		},
	},

	orderTime: {
		BranchAcceptTime: 3 * 60 * 1000,
		DriverPickup: 3 * 60 * 1000,
	},
};
