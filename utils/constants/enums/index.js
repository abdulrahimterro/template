const toArray = (enumObj) => Object.values(enumObj).filter((val) => typeof val === 'string');
module.exports = {
	toArray,
	...require('./dataBase'),
	...require('./abilities'),
};
