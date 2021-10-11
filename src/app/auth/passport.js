const passport = require('passport');

passport.use('local', require('./strategy/local'));

passport.use('jwt', require('./strategy/jwt')());

passport.use('jwtNonVerified', require('./strategy/jwt')(true));

module.exports = passport;
