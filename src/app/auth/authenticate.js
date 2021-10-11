const { Exception, errors } = require('utils');
const passport = require('./passport');

module.exports =
	(strategy, options = { strict: true }) =>
	(req, res, next) => {
		passport.authenticate(strategy, function (err, user) {
			if (err) return next(err || new Exception(errors.auth.Invalid_Auth));
			if (!user) if (options.strict) return next(err || new Exception(errors.auth.Invalid_Auth));
			req.user = user.toObject();
			next();
		})(req, res, next);
	};
