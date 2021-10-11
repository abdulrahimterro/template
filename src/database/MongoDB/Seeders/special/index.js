process.env.seed = true;
console.log('Seeding Start');
console.time('\nSeeding finished in');
require('config-keys');

const { connection, Models } = require('../../');

const mongoose = require('mongoose');
const _ = require('lodash');

connection.then(async () => {
	let docsCount = 0;
	console.time('\nCleaning Collections');

	const collections = await mongoose.connection.db.collections();
	for (const val of collections) if (val.collectionName === 'City' || val.collectionName === 'Country') await val.drop();

	console.timeEnd('\nCleaning Collections');
	console.log();

	const City = require('./City.json');
	const Country = require('./Country.json');
	data = [Country, City];
	for (const val of data) {
		let localDocsCount = 0;
		console.time('\n' + val.model);

		try {
			const documents = val.documents['geo'];

			await Models[val.model].collection.insertMany(documents);
			docsCount += documents.length;
			localDocsCount = documents.length;
		} catch (err) {
			console.log('Error in seeding ' + val.model);
			console.log(err.message);
			process.exit(1);
		}
		console.timeEnd('\n' + val.model);
		console.log('Total', val.model, 'Documents Saved:', localDocsCount);
	}

	console.log('Total Documents Saved:', docsCount);

	console.timeEnd('\nSeeding finished in');

	process.env.seed = true;
	mongoose.disconnect();
});
