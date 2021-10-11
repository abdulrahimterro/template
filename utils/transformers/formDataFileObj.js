module.exports = (req, res, next) => {
	Object.keys(req.files).forEach((key) => {
		const x = (obj, filedName) => {
			const temp = {};
			function convertFromFormNotation(obj, keys, prevObj) {
				if (keys.length > 1) {
					prevObj[keys[0]] = {};
					convertFromFormNotation(obj, keys.slice(1), prevObj[keys[0]]);
				} else prevObj[keys[0]] = obj;
			}
			const keys = filedName.replaceAll('[', ' ').replaceAll(']', '').split(' ');
			convertFromFormNotation(obj, keys, temp);
			return temp;
		};

		const val = req.files[key];
		delete req.files[key];
		Object.assign(req.files, x(val, key));
	});
	next();
};
