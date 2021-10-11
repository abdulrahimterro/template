require('./init')();
const { port } = require('config-keys');
const { Exception, logger, socket } = require('utils');
const database = require('database');

database
	.init()
	.then(() => {
		const express = require('express');
		require('express-async-errors');
		const app = express();

		require('./app')(app);
		const httpServer = require('http').createServer(app);
		socket.init(httpServer);

		httpServer.listen(port, () => {
			console.info(`Server is listening on port ${port}`);
		});
	})
	.catch(Exception.defaultHandler);
