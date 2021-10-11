const mongodb = require('./MongoDB');

const init = () =>
	Promise.all([mongodb.connection]).then(() => {
		console.log('MongoDB Connected...');
	});

module.exports = {
	init,
	mongodb,
};
