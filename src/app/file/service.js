const {
	assetsPath: { private: privateAssetPath, public: publicAssetPath },
} = require('config-keys');
const { Exception, errors, randomSetCodeGenerator } = require('utils');
const { mongodb } = require('database');
const { File } = mongodb.Models;
const mime = require('mime-types');
const fs = require('fs').promises;
class FileService {
	constructor(data, options = { isPrivateThumbnail: false, isPrivate: false, disk: false, refPath: undefined }) {
		const name = Date.now() + '_' + randomSetCodeGenerator(3);
		const ext = mime.extension(data.mimetype);
		const fileOptions = { name, refPath: options.refPath, ext, isPrivate: options.isPrivate };
		this.data = {
			name: data.name || data.fieldname,
			size: data.size,
			mimeType: data.mimetype,
			isPrivate: options.isPrivate,
			uri: FileService.uriGenerator(fileOptions),
		};
		if (options.disk) {
			this.file = {
				buffer: data.buffer,
				path: FileService.uriGenerator({ ...fileOptions, path: true }),
			};
		}
	}

	static uriGenerator({ name, path = false, isPrivate = false, refPath = 'general', ext = '' }) {
		return `${path ? (isPrivate ? privateAssetPath : publicAssetPath) : ''}/${refPath.path}/${name}.${ext}`;
	}

	async save(session) {
		const result = await new File(this.data).save({ session });
		return result.id;
	}

	static async saveArray(data, session) {
		data = data.map((val) => val.data);
		const result = await File.insertMany(data, { session });
		return result.map((val) => val.id);
	}

	async write() {
		await fs.writeFile(this.file.path, this.file.buffer);
	}

	static async delete(_id, session) {
		const result = await File.findOneAndDelete({ _id }, { session });
		if (!result) throw new Exception(errors.file.Not_Found);

		const path = (result.isPrivate ? privateAssetPath : publicAssetPath) + result.uri;
		await fs.unlink(path).catch((err) => {
			console.log(err);
			//TODO: log
		});

		return result;
	}

	static async deleteArray(ids, session) {
		const [result] = await Promise.all([
			File.find({ _id: { $in: ids } }).session(session),
			File.deleteMany({ _id: { $in: ids } }, { session }),
		]);
		await Promise.all(
			result.map((val) => {
				const path = (val.isPrivate ? privateAssetPath : publicAssetPath) + val.uri;
				return fs.unlink(path).catch((err) => {
					console.log(err);
					//TODO: log
				});
			})
		);

		return result;
	}
}

module.exports = FileService;
