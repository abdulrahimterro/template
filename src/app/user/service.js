const { Exception, errors, permissions, commonConstant, enums } = require('utils');
const { mongodb } = require('database');
const mongoose = require('mongoose');
const { User, Driver } = mongodb.Models;
const FileService = require('../file/service');
const { compare } = require('bcrypt');
class UserService {
	static admin = permissions.codes.Admin;
	static refPath = commonConstant.refPath.User;
	constructor(data, files) {
		this.firstName = data.firstName;
		this.lastName = data.lastName;
		this.phone = data.phone;
		this.oldPassword = data.oldPassword;
		this.password = data.password || data.newPassword;
		this.verificationCode = data.verificationCode;
		this.addresses = data.addresses;
		this.type = data.type;
		//Only by Admin
		this.avatar = data.avatar;
		this.verified = data.verified;
		this.abilities = data.abilities;
		this.files = [];
		if (files?.avatar) {
			const refPath = UserService.refPath.avatar;
			this.avatar = new FileService(files.avatar[0], { refPath, disk: true });
			this.files.push(this.avatar);
		}
	}

	async save(session, returnNew = false) {
		const result = await new User(this).save({ session });
		if (returnNew) return result;
		return { data: { id: result.id } };
	}

	async update(user, _id) {
		const session = await mongoose.startSession();
		await session.withTransaction(async (session) => {
			if (this.verified !== undefined) this.verifyAttempts = [];
			const result = await User.accessibleBy(user.abilities, 'update').findOneAndUpdate({ _id }, this, {
				session,
				omitUndefined: true,
			});
		});
	}

	static async getPermissions(user) {
		if (user.type !== enums.User.Types.superAdmin) throw new Exception(errors.auth.Unauthorized);
		return enums.Permission;
	}

	async updateProfile(user) {
		const session = await mongoose.startSession();
		await session.withTransaction(async (session) => {
			if (this.phone) this.verified = false;

			const result = await User.findOneAndUpdate({ _id: user.id }, this, {
				projection: 'password',
				session,
				omitUndefined: true,
			});
			if (!result) throw new Exception(errors.user.Not_Found);
			if (this.oldPassword) {
				const valid = await compare(this.oldPassword, result.password);
				if (!valid) throw new Exception(errors.auth.Invalid_Old_Password);
			}
		});
	}

	async updateFile(user) {
		const session = await mongoose.startSession();
		await session.withTransaction(async (session) => {
			if (this.avatar) this.avatar = await this.avatar.save(session);
			else return;

			let { files, ...data } = this;

			const result = await User.findOneAndUpdate({ _id: user.id }, data, {
				projection: 'password avatar',
				session,
				omitUndefined: true,
			});
			if (!result) throw new Exception(errors.user.Not_Found);

			if (result.avatar) await FileService.delete(result.avatar, session);
			await Promise.all(files.map((val) => val.write()));
		});
	}

	static async getCurrentUser(user) {
		const result = await User.findById(user.id).populate('avatar');
		return { data: result };
	}

	static async getById(user, _id) {
		const result = await User.accessibleBy(user.abilities, 'read')
			.findOne({ _id }, User.accessibleFieldsBy(user.abilities, 'read'))
			.populate('avatar');

		if (!result) throw new Exception(errors.user.Not_Found);
		return { data: result };
	}

	static async getByCriteria(user, criteria, { skip, limit, total }) {
		const conditions = (() => {
			const result = { _id: { $ne: user.id }, ...criteria };

			if (criteria.firstName) result['firstName'] = new RegExp(`^${criteria.firstName}`, 'i');
			if (criteria.lastName) result['lastName'] = new RegExp(`^${criteria.lastName}`, 'i');
			if (criteria.phone) result['phone'] = new RegExp(`^\\+${criteria.phone}`, 'i');

			if (criteria.country) {
				result['address.country'] = criteria.country;
				delete result.country;
			}
			if (criteria.city) {
				result['address.city'] = criteria.city;
				delete result.city;
			}

			return result;
		})();
		const result = await User.findAndCount(
			total,
			{ ...conditions, ...User.accessibleBy(user.abilities, 'list').getQuery() },
			User.accessibleFieldsBy(user.abilities, 'read'),
			{ skip, limit, populate: { path: 'avatar', select: '-_id' } }
		);
		return result;
	}
}

module.exports = UserService;
