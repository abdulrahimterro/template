const { checkAccessibility, permissions, multerUpload, enums } = require('utils');
const { User, Admin } = permissions.codes;
const handler = require('./handler');
const validator = require('./validator');
const router = require('express').Router();
const subject = enums.Permission.User.Name;
const Action = enums.Permission.User.Action;
// 1024 * 1024 * 5 = 5 mb
const upload = multerUpload(1, 1024 * 1024 * 5, ['image/jpeg', 'image/png']).fields([{ name: 'avatar', maxCount: 1 }]);

/************************
 * @Router  /api/user   *
 ************************/

router.patch('/', checkAccessibility(), validator.updateProfile, handler.updateProfile);

router.patch('/file', checkAccessibility(), upload, handler.updateFile);

router.patch('/:id', checkAccessibility({ action: Action.Update, subject }), validator.update, handler.update);

router.get('/permission', checkAccessibility(), handler.getPermissions);

router.patch('/:id/grantPermission', checkAccessibility(), validator.grantPermissions, handler.grantPermissions);

router.patch('/:id/revokePermission', checkAccessibility(), validator.revokePermissions, handler.revokePermissions);

router.get('/params', handler.getParams);

router.get('/my', checkAccessibility('jwtNonVerified'), handler.getCurrentUser);

router.get('/:id', checkAccessibility({ action: Action.Read, subject }), validator.paramId, handler.getById);

router.get('/', checkAccessibility({ action: Action.List, subject }), validator.getByCriteria, handler.getByCriteria);

module.exports = router;
