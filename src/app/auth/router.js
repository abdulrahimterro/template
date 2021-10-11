const { checkAccessibility } = require('utils');
const handler = require('./handler');
const validator = require('./validator');
const router = require('express').Router();

/************************
 * @Router /api/auth    *
 ************************/

router.post('/signup', validator.signUp, handler.signUp);

router.post('/verify', validator.verify, handler.verify);

router.post('/login', validator.login, handler.login);

router.post('/resend-verification', validator.resendVerification, handler.resendVerification);

router.post('/refresh-token', validator.refreshToken, handler.refreshToken);

module.exports = router;
