const { checkAccessibility, permissions, multerUpload, enums } = require('utils');
const { Admin } = permissions.codes;
const handler = require('./handler');
const validator = require('./validator');
const router = require('express').Router();
const subject = enums.Permission.Pizza_Ingredient.Name;
const Action = enums.Permission.Pizza_Ingredient.Action;
// 1024 * 1024 * 5 = 5 mb
const uploadDefault = multerUpload(2, 1024 * 1024 * 5, ['image/jpeg', 'image/png']).fields([
	{ name: 'icon', maxCount: 1 },
	{ name: 'defaultPicture', maxCount: 1 },
]);
const uploadImages = multerUpload(1, 1024 * 1024 * 5, ['image/jpeg', 'image/png']).fields([{ name: 'images', maxCount: 1 }]);

/****************************
 * @Router	/pizza_Ingredient *
 ****************************/
router.use('/category', require('./category/router'));

router.post('/', checkAccessibility({ action: Action.Create, subject }), uploadDefault, validator.save, handler.save);

router.patch('/:id', checkAccessibility({ action: Action.Update, subject }), uploadDefault, validator.update, handler.update);

router.post('/:id/image', checkAccessibility({ action: Action.Update, subject }), uploadImages, validator.updateFile, handler.updateFile);

router.delete('/:id', checkAccessibility({ action: Action.Delete, subject }), validator.paramId, handler.delete);

router.delete('/:id/image', checkAccessibility({ action: Action.Update, subject }), validator.paramId, handler.deleteFile);

router.get('/', validator.getByCriteria, handler.getByCriteria);

router.get('/:id', validator.paramId, handler.getById);

module.exports = router;
