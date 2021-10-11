const { checkAccessibility, permissions, multerUpload } = require('utils');
const { Admin } = permissions.codes;
const handler = require('./handler');
const validator = require('./validator');
const router = require('express').Router();

/*************************************
 * @Router	/pizza/ingredient/category *
 *************************************/

router.get('/', handler.getByCriteria);

router.get('/:id', validator.paramId, handler.getById);

module.exports = router;
