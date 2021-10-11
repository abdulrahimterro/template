const AWS = require('aws-sdk');
const { App, aws, services } = require('config-keys');

let enable = false;
if (services.sms === true)
	if (!aws) {
		console.log('Warning missing SMS configuration.');
	} else enable = true;

if (enable)
	AWS.config.update({
		...aws,
		attributes: { DefaultSMSType: 'Transactional' },
	});

const send = async (phoneNumber, message) => {
	if (enable) {
		if (!message) throw Error('missing or wrong message');
		if (!phoneNumber) throw Error('missing or wrong phoneNumber');
		console.log(`Sending verification code to ${phoneNumber}`);
		await new AWS.SNS({ apiVersion: '2010-03-31' })
			.publish({
				Message: message,
				PhoneNumber: phoneNumber,
				MessageAttributes: { 'AWS.SNS.SMS.SenderID': { DataType: 'String', StringValue: App.name } },
			})
			.promise();
		return 'Message Sended';
	} else {
		console.warn('SMS service disabled.');
		return 'SMS service disabled.';
	}
};

module.exports = { send };
