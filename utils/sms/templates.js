const sms = require('./sms');
const { App } = require('config-keys');

module.exports = {
	sendActivationCode: async (phoneNumber, code) => {
		if (code) return sms.send(phoneNumber, `${App.name} activation code: ${code}`);
		else throw Error('code is required');
	},
};
