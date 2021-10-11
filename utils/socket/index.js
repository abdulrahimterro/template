const SocketService = require('./service');
const authorization = require('./auth');

const init = (httpServer) => {
	const io = require('socket.io')(httpServer, { cors: { origin: '*' } });

	// Auth
	io.use(authorization);

	io.on('connection', (client) => {
		SocketService.connection(client);
	});

	global.io = io;
};

module.exports.init = init;
