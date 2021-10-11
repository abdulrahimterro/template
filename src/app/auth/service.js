const JWT = require('jsonwebtoken');
const UserService = require('../user/service');
const { mongodb } = require('database');
const mongoose = require('mongoose');
const { Session, User } = mongodb.Models;
const { errors, Exception, sms, enums, randomSetCodeGenerator } = require('utils');
const { jwt } = require('config-keys');
const { compare } = require('bcrypt');
const moment = require('moment');
// TODO: check user type => assign ability
// fix enums ability
class AuthService {
	static verificationCode = 111111;
	static async signUp(data, driver = false, branchId) {
		let result, user;
		const session = await mongoose.startSession();
		await session.withTransaction(async (session) => {
			data.verificationCode = AuthService.verificationCode;
			// data.verificationCode = randomSetCodeGenerator(6);
			if (!driver) {
				user = await new UserService(data).save(session, true);
				user.abilities = enums.DefaultAbility[user.type](user._id);
			} else {
				data.type = enums.User.Types.Driver;
				user = await new UserService(data).saveDriver(session, true);
				user.abilities = enums.DefaultAbility[user.type](branchId);
			}
			await user.save({ session });
			result = await this.#getTokens(user, session);
			await sms.sendActivationCode(user.phone, data.verificationCode);
		});
		return { data: result };
	}

	static async login(data) {
		let result;
		const session = await mongoose.startSession();
		await session.withTransaction(async (session) => {
			const user = await User.findOne({ phone: data.phone }, 'password verified verificationCode', { session });
			if (!user) throw new Exception(errors.auth.Invalid_Auth_Phone_Password);

			// method 1 : phone & password
			if (data.password) {
				const verify = await compare(data.password, user.password);
				if (!verify) throw new Exception(errors.auth.Invalid_Auth_Phone_Password);
				result = { data: await this.#getTokens(user, session) };
				return;
			}

			// method 2 : phone, token & code
			if (data.token) {
				JWT.verify(data.token, jwt.tokenCode.key, (err, payload) => {
					if (err) throw new Exception(errors.auth.Invalid_Auth_Code_Token);
				});
				if (user.verificationCode !== data.code) throw new Exception(errors.auth.Invalid_Auth_Verify_Code);
				await user.update({ verificationCode: null, verified: true }, { session });
				result = { data: await this.#getTokens(user, session) };
				return;
			}

			// method 3 : phone
			//TODO: add limit attempts
			const codeToken = JWT.sign({ id: user.id }, jwt.tokenCode.key, {
				expiresIn: jwt.tokenCode.expirationDuration,
			});
			user.verificationTokenCode = AuthService.verificationCode;
			// user.verificationTokenCode = randomSetCodeGenerator(6);
			await Promise.all([user.save({ session }), sms.sendActivationCode(user.phone, user.verificationCode)]);

			result = { data: { codeToken, msg: 'Message sent to mobile phone' } };
		});
		return result;
	}

	static async verify(user, { phone, code }) {
		const result = await User.updateOne({ phone, verificationCode: code }, { verificationCode: null, verified: true });
		if (!result.n) throw new Exception(errors.auth.Invalid_Auth_Verify_Code);
		if (!result.nModified) throw new Exception(errors.auth.Account_Already_Verified);
	}

	static async resendVerification(user, { phone }) {
		const session = await User.startSession();
		await session.withTransaction(async (session) => {
			const verificationCode = AuthService.verificationCode; //randomSetCodeGenerator(6)
			const user = await User.findOneAndUpdate(
				{ phone },
				{ verificationCode, $push: { verifyAttempts: new Date() } },
				{ projection: 'phone verified verifyAttempts', session }
			);

			if (!user) throw new Exception(errors.user.Not_Found);
			if (user.verified) throw new Exception(errors.auth.Account_Already_Verified);

			const attempts = [undefined, 2, 5, 10, 30, 120, 360, 720, 1440];
			let attemptNumber = user.verifyAttempts.length - 1;
			if (attemptNumber > attempts.length) attemptNumber = attempts.length - 1;

			if (attemptNumber >= 0 && !(moment().diff(user.verifyAttempts[attemptNumber], 'minutes') < attempts[attemptNumber]))
				throw new Exception(
					errors.auth.Resend_Verification_Attempts(user.verifyAttempts[attemptNumber], attempts[attemptNumber])
				);

			await sms.sendActivationCode(user.phone, verificationCode);
		});
	}

	static async refreshToken(data) {
		let result, accessToken;
		const session = await Session.startSession();
		await session.withTransaction(async (session) => {
			const { id } = JWT.verify(data.token, jwt.refreshToken.key);
			result = await Session.findOne({ user: id, token: data.token }).session(session);
			if (!result) throw new Exception(errors.auth.Invalid_Auth_Token);

			const now = new Date();
			if (moment(result.createdAt).add(jwt.refreshToken.expirationDuration, 'days').isBefore(now)) {
				await result.delete({ session: null }); // out of session
				throw new Exception(errors.auth.Token_Expired);
			}

			accessToken = JWT.sign({ id: result.user }, jwt.accessToken.key, {
				expiresIn: jwt.accessToken.expirationDuration,
			});

			const passed = now - result.createdAt;
			const remaining = moment(result.createdAt).add(jwt.refreshToken.expirationDuration, 'days') - now;
			const percentage = (passed / remaining) * 100;
			if (percentage >= 13) {
				result.createdAt = new Date();
				await result.save({ session });
			}
		});

		return { data: { accessToken, refreshToken: result.token } };
	}

	static async #getTokens(user, session) {
		const result = {};
		result.accessToken = JWT.sign({ id: user.id }, jwt.accessToken.key, {
			expiresIn: jwt.accessToken.expirationDuration,
		});
		result.refreshToken = JWT.sign({ id: user.id }, jwt.refreshToken.key);

		const refresh = await Session.findOneAndUpdate({ user: user.id, createdAt: new Date() }).session(session);

		if (refresh) result.refreshToken = refresh.token;
		else {
			result.refreshToken = JWT.sign({ id: user.id }, jwt.refreshToken.key);
			await new Session({ user: user.id, token: result.refreshToken }).save({ session });
		}

		return result;
	}
}

module.exports = AuthService;
