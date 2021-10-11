module.exports = async () => {
	console.time('Data Initialization');
	const fs = require('fs').promises;

	const dataFolder = 'src/database/MongoDB/Seeders/data/';

	let dirs = await fs.readdir(dataFolder);

	const data = dirs.map((val) => require('./data/' + val));

	console.timeEnd('Data Initialization');
	return data;
};
