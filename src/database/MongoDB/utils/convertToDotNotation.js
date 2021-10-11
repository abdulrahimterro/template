module.exports = (obj) => {
	function convertToDotNotation(obj, newObj = {}, prefix = '') {
		for (let key in obj) {
			if (typeof obj[key] === 'object') {
				let newPrefix;
				if (Array.isArray(obj[key])) newPrefix = prefix + key + '.$';
				else if (Array.isArray(obj)) newPrefix = prefix + '.';
				else newPrefix = prefix + key + '.';

				convertToDotNotation(obj[key], newObj, newPrefix);
			} else {
				let index = prefix + key;
				if (Array.isArray(obj)) index = prefix;
				newObj[index] = obj[key];
			}
		}
		return newObj;
	}

	return convertToDotNotation(obj);
};
