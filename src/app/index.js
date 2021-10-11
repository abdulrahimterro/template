const express = require('express');
const path = require('path');
const cors = require('cors');
const { Exception, logger } = require('utils');
const passport = require('./auth/passport');

module.exports = (app) => {
	app.use(cors());

	app.get('/', (req, res) => res.status(200).json({ msg: 'welcome' }));

	app.use('/assets/public', express.static(path.join('assets', 'public')));
	app.use('/test/html', express.static(path.join('test', 'html')));

	app.use('/test', (req, res) => res.status(200).json({ msg: 'welcome test' }));

	app.use(express.urlencoded({ extended: false }));
	app.use(
		express.json({
			limit: '10mb',
			// We need the raw body to verify webhook signatures.
			// Let's compute it only when hitting the Stripe webhook endpoint.
			verify: function (req, res, buf) {
				if (/webhook/i.test(req.originalUrl)) {
					req.rawBody = buf.toString();
				}
			},
		})
	);

	app.use(logger.httpLogger);

	app.use(passport.initialize());

	app.use((req, res, next) => {
		req.locals = {};
		// res.setTimeout(1000 * 60 * 10);
		next();
	});

	app.use('/api', require('./router'));

	app.use(Exception.handler);
};
