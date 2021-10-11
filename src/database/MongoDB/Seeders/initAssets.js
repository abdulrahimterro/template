module.exports = async (general, modes) => {
	console.time('Assets Initialization');
	const fs = require('fs').promises;
	const mime = require('mime-types');
	const { file } = require('utils');
	await file.createAssetsDir();
	const assetsFolder = 'src/database/MongoDB/Seeders/assets';
	const dataFile = require('./data/File.json');

	let files = await fs.readdir(assetsFolder);
	files = files.reduce((acc, curr) => (acc[mime.lookup(curr)] = curr) && acc, {});

	const currentModes = [];
	if (general) currentModes.push('general');
	currentModes.push(...dataFile.modes.filter((val) => modes.includes(val)));
	const documents = currentModes.flatMap((mode) => dataFile.documents[mode]).filter((val) => val !== undefined);

	const result = Promise.all(
		documents.map((val) => {
			if (files[val.mimeType] === undefined) {
				console.log('Error:');
				console.log(
					`	Type('${val.mimeType}') Asset Type Not Found\n	Please Add Asset With Type('${val.mimeType}') To Assets`
				);
				process.exit(1);
			}
			return fs.copyFile(
				`${assetsFolder}/${files[val.mimeType]}`,
				`assets/${val.isPrivate ? 'private' : 'public'}/${val.uri}`
			);
		})
	);
	console.timeEnd('Assets Initialization');
	return result;
};
