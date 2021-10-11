const { checkAccessibility, permissions, multerUpload, enums } = require('utils');
const { Admin } = permissions.codes;
const handler = require('./handler');
const validator = require('./validator');
const router = require('express').Router();
const subject = enums.Permission.Pizza.Name;
const Action = enums.Permission.Pizza.Action;
// 1024 * 1024 * 10 = 10 mb
const upload = multerUpload(8, 1024 * 1024 * 10, ['image/jpeg', 'image/png']).fields([{ name: 'images', maxCount: 6 }]);
/****************************
 * @Router	/item           *
 ****************************/
router.use('/ingredient', require('./ingredient/router'));

router.post('/', checkAccessibility({ action: Action.Create, subject }), validator.save, handler.save);

router.put('/:id', checkAccessibility({ action: Action.Update, subject }), validator.update, handler.update);

router.patch('/:id/file', checkAccessibility({ action: Action.Update, subject }), upload, validator.paramId, handler.updateFile);

router.delete('/:id', checkAccessibility({ action: Action.Delete, subject }), validator.paramId, handler.delete);

router.delete('/:id/file', checkAccessibility({ action: Action.Update, subject }), validator.paramId, handler.deleteFile);

router.get('/', validator.getByCriteria, handler.getByCriteria);

router.get('/:id', validator.paramId, handler.getById);

module.exports = router;
