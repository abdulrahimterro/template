module.exports = {
	User: {
		Types: {
			superAdmin: 'superAdmin',
			Restaurant: 'Restaurant',
			Driver: 'Driver',
			Customer: 'Customer',
		},
	},

	Permission: {
		Branch: {
			Name: 'Branch',
			Action: { Create: 'create', Read: 'read', Update: 'update', Delete: 'delete', List: 'list' },
			Fields: {
				name: 'name',
				workingDays: 'workingDays',
				status: 'status',
				description: 'description',
				address: 'address',
				phone: 'phone',
				avatar: 'avatar',
				coverImage: 'coverImage',
				images: 'images',
				ordersCount: 'ordersCount',
				taxes: 'taxes',
				drivers: 'drivers',
			},
		},
		Order: {
			Name: 'Order',
			Action: { Create: 'create', Read: 'read', Update: 'update', Delete: 'delete', List: 'list', Cancel: 'cancel' },
			Fields: {
				user: 'user',
				branch: 'branch',
				address: 'address',
				type: 'type',
				rendezvous: 'rendezvous',
				status: 'status',
				supTotal: 'supTotal',
				totalPrice: 'totalPrice',
				items: 'items',
				paymentStatus: 'paymentStatus',
				payment: 'payment',
				acceptedTime: 'acceptedTime',
				readyTime: 'readyTime',
				delivery: 'delivery',
			},
		},
		Pizza: {
			Name: 'Pizza',
			Action: { Create: 'create', Update: 'update', Delete: 'delete' },
			Fields: {
				category: 'category',
				title: 'title',
				subtitle: 'subtitle',
				description: 'description',
				includeTax: 'includeTax',
				discount: 'discount',
				crust: 'crust',
				images: 'images',
			},
		},
		Pizza_Ingredient: {
			Name: 'Pizza_Ingredient',
			Action: { Create: 'create', Update: 'update', Delete: 'delete' },
			Fields: {
				category: 'category',
				title: 'title',
				description: 'description',
				defaultPicture: 'defaultPicture',
				icon: 'icon',
				images: 'images',
			},
		},
		Payment: {
			Name: 'Payment',
			Action: { Read: 'read', List: 'list' },
			Fields: {
				user: 'user',
				order: 'order',
				currency: 'currency',
				amount: 'amount',
				paymentDate: 'paymentDate',
				status: 'status',
				stripe: 'stripe',
			},
		},
		User: {
			Name: 'User',
			Action: { Create: 'create', Read: 'read', Update: 'update', Delete: 'delete', List: 'list' },
			Fields: {
				firstName: 'firstName',
				lastName: 'lastName',
				password: 'password',
				phone: 'phone',
				addresses: 'addresses',
				avatar: 'avatar',
				verificationCode: 'verificationCode',
				verified: 'verified',
				verifyAttempts: 'verifyAttempts',
				type: 'type',
				abilities: 'abilities',
			},
		},
		Driver: {
			Name: 'Driver',
			Action: { Create: 'create', Accept: 'accept', PickUp: 'pickUp', Delivered: 'delivered' },
			Fields: { status: 'status', orders: 'orders' },
		},
	},
	subjects: ['Branch', 'Order', 'Pizza', 'Pizza_Ingredient', 'Payment', 'User', 'Driver'],
	DefaultAbility: {
		superAdmin: [{ action: 'manage', subject: 'all' }],

		Restaurant: (branchId) => [
			{
				action: 'read',
				subject: 'branch',
				resources: { key: 'branch.id', resource: [branchId] },
			},
		],

		Driver: (branchId) => [
			{
				action: 'read',
				subject: 'Order',
				resources: { key: 'branch.id', resource: [branchId] },
			},
			{
				action: 'list',
				subject: 'Order',
				resources: { key: 'branch.id', resource: [branchId] },
			},
			{
				action: 'accept',
				subject: 'Order',
				resources: { key: 'branch.id', resource: [branchId] },
			},
			{
				action: 'pickUp',
				subject: 'Order',
				resources: { key: 'branch.id', resource: [branchId] },
			},
			{
				action: 'delivered',
				subject: 'Order',
				resources: { key: 'branch.id', resource: [branchId] },
			},
		],

		Customer: (userId) => [
			{
				action: 'create',
				subject: 'Order',
			},
			{
				action: 'read',
				subject: 'Order',
				resources: { key: 'user', resource: [userId] },
			},
			{
				action: 'list',
				subject: 'Order',
				resources: { key: 'user', resource: [userId] },
			},
			{
				action: 'cancel',
				subject: 'Order',
				resources: { key: 'user', resource: [userId] },
			},
		],
	},
};
