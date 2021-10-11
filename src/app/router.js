const router = require('express').Router();

/********************
 * @Router /api     *
 ********************/

router.use('/user', require('./user/router'));

router.use('/auth', require('./auth/router'));

router.use('/pizza', require('./pizza/router'));

module.exports = router;
