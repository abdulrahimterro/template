const multer = require('multer');
const errors = require('../error-handlers/errors');
const Exception = require('../error-handlers/Exception');

module.exports = (fieldsCount, fileSize, allowedTypes) =>
	multer({
		limits: {
			files: fieldsCount,
			fileSize,
			includeEmptyFields: true,
			inMemory: true,
		},
		fileFilter: (req, file, cb) => {
			if (!allowedTypes.includes(file.mimetype)) {
				cb(new Exception(errors.multer.UnSupported_Media_Type(file.mimetype, allowedTypes)));
			}
			cb(null, true);
		},
	});
