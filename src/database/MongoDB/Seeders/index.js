// TODO seed data as soon as it available don't require all data first
process.env.seed = true;
console.log('Seeding Start');
console.time('\nSeeding finished in');
require('config-keys');
let processModes = process.argv.slice(2);
let general = true;
if (processModes.includes('notGeneral')) {
	processModes = processModes.filter((val) => val !== 'notGeneral');
	general = false;
}
const modes = processModes;
console.log('Seeding Modes:', modes);
const { connection, Models } = require('../');
const mongoose = require('mongoose');
const _ = require('lodash');
if (modes.length === 0 && general === false) {
	console.log('No Seeding Mode Found');
	process.exit(0);
}
connection.then(async () => {
	let docsCount = 0;
	console.time('\nCleaning Collections');

	const collections = await mongoose.connection.db.collections();
	for (const val of collections) {
		if (val.collectionName === 'City' || val.collectionName === 'Country') continue;
		await val.drop();
	}

	console.timeEnd('\nCleaning Collections');
	console.log();

	let data = require('./initData');
	data = await data();
	for (const val of data) {
		let localDocsCount = 0;
		console.time('\n' + val.model);
		const currentModes = [];
		if (general) currentModes.push('general');
		currentModes.push(...val.modes.filter((val) => modes.includes(val)));

		try {
			const documents = currentModes.flatMap((mode) => val.documents[mode]).filter((val) => val !== undefined);

			if (Models[val.model]) {
				await Models[val.model].insertMany(documents);
				docsCount += documents.length;
				localDocsCount = documents.length;
			}
		} catch (err) {
			console.log('Error in seeding ' + val.model);
			console.log(err.message);
			process.exit(1);
		}
		console.timeEnd('\n' + val.model);
		console.log('Modes:', currentModes);
		console.log('Total', val.model, 'Documents Saved:', localDocsCount);
	}

	const assets = require('./initAssets');
	console.time('\nAssets Seed Finish');
	let assetsCount = 0;
	const assetResult = await assets(general, modes);
	assetsCount += assetResult.length;
	console.timeEnd('\nAssets Seed Finish');

	console.log('\nTotal Assets Saved:', assetsCount);
	console.log('Total Documents Saved:', docsCount);

	console.timeEnd('\nSeeding finished in');

	process.env.seed = true;
	mongoose.disconnect();
});
