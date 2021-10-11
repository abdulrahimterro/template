module.exports = {
	General: {
		View: {
			My: 'My',
			All: 'All',
			Default: 'Default',
		},
	},

	pizza: {
		pizzaCategory: {
			meats: 'meats',
			chicken: 'chicken',
			vegans: 'vegans',
			custom: 'custom',
		},
		ingredientCategory: {
			category: {
				basic: 'basic',
				toppings: 'toppings',
			},
			basic: {
				crust: 'crust',
				sauce: 'sauce',
				cheese: 'cheese',
				crustFlavor: 'crust Flavor',
			},
			toppings: {
				meats: 'meats',
				vegans: 'vegans',
			},
		},
		size: {
			value: {
				large: 'large',
				medium: 'medium',
				personal: 'personal',
			},
		},
		amount: {
			basic: {
				extra: 'extra',
				regular: 'regular',
				light: 'light',
			},
			toppings: {
				extra: 'extra',
				regular: 'regular',
			},
			sides: {
				left: 'left',
				right: 'right',
			},
		},
	},

	Branch: {
		Status: {
			Open: 'Open',
			Closed: 'Closed',
			Busy: 'Busy',
		},
		WorkingDay: {
			Day: {
				Saturday: 'Saturday',
				Sunday: 'Sunday',
				Monday: 'Monday',
				Tuesday: 'Tuesday',
				Wednesday: 'Wednesday',
				Thursday: 'Thursday',
				Friday: 'Friday',
			},
		},
	},

	Order: {
		Status: {
			Pending: 'Pending',
			Accepted: 'Accepted',
			BranchAccepted: 'BranchAccepted',
			DriverAccepted: 'DriverAccepted',
			Rejected: 'Rejected',
			Ready: 'Ready',
			Delivering: 'Delivering',
			Delivered: 'Delivered',
			Picked_Up: 'Picked Up',
			Waiting: 'Waiting',
			Canceled: 'Canceled',
		},

		Types: {
			Carry_Out: 'Carry out',
			Delivery: 'Delivery',
			Inside: 'Inside',
		},
	},

	Payment: {
		Status: {
			Pending: 'Pending',
			Hold: 'Hold',
			Done: 'Done',
			Failed: 'Failed',
			Canceled: 'Canceled',
			Refunded: 'Refunded',
		},

		Currency: {
			USD: 'usd',
			CAD: 'cad',
		},
	},

	Driver: {
		status: {
			Online: 'Online',
			Busy: 'Busy',
			Offline: 'Offline',
		},
	},
};
