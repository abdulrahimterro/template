const casl = require('./casl');

module.exports = (p = { strategy: 'jwt', action: undefined, subject: undefined, strict: true }) => {
	const authenticate = require('../../src/app/auth/authenticate');
	let strategy = 'jwt';
	let strict = true;
	let action, subject;
	if (typeof p === 'string') {
		strategy = p;
	} else {
		strategy = p.strategy ?? strategy;
		strict = p.strict ?? strict;
		action = p.action;
		subject = p.subject;
	}

	return [authenticate(strategy, { strict }), casl(action, subject)];
};
