const _ = require('lodash');

const transform = (__, ret, hide = []) => {
	delete ret._id && delete ret.__t;
	ret = _.omit(ret, hide);
	if (ret.id === null) delete ret.id;
	const { id, ...rest } = ret;
	return { id, ...rest };
};

module.exports = (params = { timestamps: true, _id: true, hide: [] }) => {
	const options = { timestamps: params.timestamps };
	if (params._id === false) options._id = false;
	return {
		...options,
		useNestedStrict: true,
		optimisticConcurrency: true,
		toObject: {
			virtuals: true,
			getters: true,
			versionKey: false,
			transform: (__, ret) => transform(__, ret, params.hide),
		},
		toJSON: {
			virtuals: true,
			getters: true,
			versionKey: false,
			transform: (__, ret) => transform(__, ret, params.hide),
		},
	};
};
