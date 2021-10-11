const tree = {
	code: 'root',
	description: 'Super Admin Permission',
	subPermissions: {
		Admin: {
			code: 'admin',
			description: 'Admin Permission',
			subPermissions: {
				User: {
					code: 'user',
					description: 'User Permission',
					default: true,
					subPermissions: {},
				},
			},
		},
	},
};

/**************************************************************************************************/

const permissions = {};
function build(obj, key, parent = []) {
	obj.parent = parent;
	if (obj.subPermissions) {
		const { subPermissions, ...data } = obj;
		permissions[key] = data;
		Object.keys(obj.subPermissions).forEach((val) => {
			build(obj.subPermissions[val], val, [...parent, obj.code]);
			if (!obj.subPermissions[val].subPermissions) permissions[key][val] = obj.subPermissions[val];
		});
	}
}
build(tree, 'Root');

/**************************************************************************************************/

// const fs = require('fs');
// fs.writeFileSync(__dirname + '/permissions.json', JSON.stringify(permissions, null, 4));

module.exports = permissions;
