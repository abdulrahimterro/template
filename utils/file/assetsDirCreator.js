const fs = require('fs').promises;
const { assetsPath } = require('config-keys');
const { refPath } = require('../constants/common');

module.exports = async () => {
	const dirs = [];
	function extract(obj) {
		Object.keys(obj).forEach((val) => {
			if (val === 'path') {
				if (obj.access?.length > 0)
					obj.access.forEach((val) => {
						dirs.push('assets/' + val + '/' + obj.path);
					});
				else dirs.push('assets/' + 'public' + '/' + obj.path);
			} else if (val !== 'access') extract(obj[val]);
		});
	}
	extract(refPath);
	await fs.rm('assets', { recursive: true, force: true });
	await Promise.all(dirs.map((val) => fs.mkdir(val, { recursive: true })));
};
