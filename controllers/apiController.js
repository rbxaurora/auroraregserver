const jwt = require(`jsonwebtoken`);
const bcrypt = require(`bcryptjs`);
const User = require(`../models/User`);
const Role = require(`../models/Role`);
const Member = require('../models/Member');
const Report = require('../models/Report');
const { secret } = require(`../config.js`);


class apiController {
	async getUser (req, res) {
		const authToken = req.headers.authorization.split(` `)[1];

		if (!authToken) {
			return res.status(401).json({ error: "Пользователь не авторизован" });
		}

		try {
			const decodedData = jwt.verify(authToken, secret);

			const user = await User.findOne({ _id: decodedData.id }).populate('roles');

			if (!user) {
				return res.status(404).json({ error: "Пользователь не найден." });
			}

			return res.status(200).json(user);
		} catch (e) {
			console.log(e);
			return res.status(400).json({ error: 'Ошибка получения пользователя' })
		}
	}

	async getUsersList (req, res) {
		const authToken = req.headers.authorization.split(` `)[1];

		if (!authToken) {
			return res.status(401).json({ error: 'Пользователь не авторизован' });
		}

		try {
			const decodedData = jwt.verify(authToken, secret);
			
			const role = await Role.findOne({ _id: decodedData.roles });

			if (role.value == 'USER' || role.value == 'SPECTATOR') {
				return res.status(403).json({ error: 'Доступ запрещен.' });
			}

			const users = await User.find().populate('roles');

			return res.status(200).json(users);
		} catch (e) {
			console.log(e)
			return res.status(400).json({ error: 'Ошибка получения списка пользователей' });
		}		
	}

	async getUserInfo (req, res) {
		const authToken = req.headers.authorization.split(` `)[1];
		const { userId } = req.query;

		if (!authToken) {
			return res.status(401).json({ error: 'Пользователь не авторизован' });
		}

		try {
			const decodedData = jwt.verify(authToken, secret);

			const role = await Role.findOne({ _id: decodedData.roles });

			if (role.value != 'OWNER') {
				return res.status(403).json({ error: 'Доступ запрещен' })
			}

			const user = await User.findOne({ _id: userId }).populate('roles');
			const roles = await Role.find();

			return res.status(200).json([user, roles]);
		} catch (e) {
			return res.status(400).json({ error: 'Ошибка получения данных пользователя' });
		}
	}

	async saveUser (req, res) {
		const authToken = req.headers.authorization.split(` `)[1];
		const { userName, userNick, userRole, userPass, id } = req.body;
		let hash;

		if (!authToken) {
			return res.status(401).json({ error: 'Пользователь не авторизован' });
		}

		try {
			const decodedData = jwt.verify(authToken, secret);

			const role = await Role.findOne({ _id: decodedData.roles });

			if (role.value != 'OWNER') {
				return res.status(403).json({ error: 'Доступ запрещен' });
			}

			if (userPass) {
				hash = bcrypt.hashSync(userPass, 7);
				await User.updateOne({ _id: id }, {
					$set: {
						password: hash
					}
				});
			}

			if (userNick) {
				await User.updateOne({ _id: id }, {
					$set: {
						usernick: userNick
					}
				});
			}

			if (userName) {
				await User.updateOne({ _id: id }, {
					$set: {
						username: userName
					}
				});
			}

			if (userRole) {
				const role = await Role.findOne({ value: userRole });

				await User.updateOne({ _id: id }, {
					$set: {
						roles: role._id
					}
				});
			}

			return res.status(200).json({ message: 'Данные о пользователе изменены' });
		} catch (e) {
			return res.status(400).json({ error: 'Ошибка в изменении данных', err: e });
		}
	}

	async getMemberInfo (req, res) {
		let { value } = req.query;
		let membersList = [];
		value = value.toLowerCase();

		const members = await Member.find();

		for (let i = 0; i < members.length; i++) {
			const member = members[i];

			const roblox = member.roblox.toLowerCase();

			if (roblox.includes(value)) {
				membersList.push(member);
			}
		}

		return res.status(200).json(membersList);
	}

	async sendReport (req, res) {
		let authToken = req.headers.authorization.split(` `)[1];
		const { date, memberList } = req.body;

		if (!authToken) {
			return res.status(401).json({ error: 'Пользователь не авторизован' });
		}

		try {
			const decodedData = jwt.verify(authToken, secret);

			const role = await Role.findOne({ _id: decodedData.roles });

			if (role.value == 'USER') {
				return res.status(403).json({ error: 'Доступ запрещен' });
			}

			const admin = await User.findOne({ _id: decodedData.id });

			const report = new Report({
				adminLogin: admin.username,
				date: date,
				memberList: memberList
			});

			await report.save();

			return res.status(200).json({ message: 'Репорт отправлен успешно' });
		} catch (e) {
			console.log(e)
			return res.status(400).json({ error: 'Ошибка отправки репорта' })
		}
	}

	async getReg (req, res) {
		const authToken = req.headers.authorization.split(' ')[1];

		if (!authToken) {
			return res.status(401).json({ error: 'Пользователь не авторизован' });
		}

		try {
			const decodedData = jwt.verify(authToken, secret);

			const role = await Role.findOne({ _id: decodedData.roles });

			if (role.value == 'USER' || role.value == 'SPECTATOR') {
				return res.status(403).json({ error: 'Доступ запрещен' });
			}

			const reports = await Report.find().sort({ createdAt: -1 }).limit(3);

			return res.status(200).json(reports);
		} catch (e) {
			console.log(e);
			return res.status(400).json({ error: 'Ошибка получения списка реестра.' });
		}
	}

	async getAllReg (req, res) {
		const authToken = req.headers.authorization.split(' ')[1];

		if (!authToken) {
			return res.status(401).json({ error: 'Пользователь не авторизован' });
		}

		try {
			const decodedData = jwt.verify(authToken, secret);

			const role = await Role.findOne({ _id: decodedData.roles });

			if (role.value == 'USER' || role.value == 'SPECTATOR') {
				return res.status(403).json({ error: 'Доступ запрещен' });
			}

			const reports = await Report.find().sort({ createdAt: -1 });

			return res.status(200).json(reports);
		} catch (e) {
			console.log(e);
			return res.status(400).json({ error: 'Ошибка получения списка реестра.' });
		}
	}

	async deleteAccount (req, res) {
		const authToken = req.headers.authorization.split(' ')[1];
		const { id } = req.body;

		if (!authToken) {
			return res.status(401).json({ error: 'Пользователь не авторизован' });
		}

		try {
			const decodedData = jwt.verify(authToken, secret);

			const role = await Role.findOne({ _id: decodedData.roles });

			if (role.value == 'USER') {
				return res.status(403).json({ error: 'Доступ запрещен' });
			}

			await User.deleteOne({ _id: id });

			return res.status(200).json({ error: "Пользователь удален." });
		} catch (e) {
			console.log(e);
			return res.status(400).json({ error: 'Ошибка удаления пользователя' });
		}
	}

	async getMembersList (req, res) {
		const authToken = req.headers.authorization.split(` `)[1];

		if (!authToken) {
			return res.status(401).json({ error: 'Пользователь не авторизован' });
		}

		try {
			const decodedData = jwt.verify(authToken, secret);

			const role = await Role.findOne({ _id: decodedData.roles });

			if (role.value == 'USER') {
				return res.status(403).json({ error: 'Доступ запрещен' });
			}

			const members = await Member.find();

			return res.status(200).json(members);
		} catch (e) {
			console.log(e);
			return res.status(400).json({ error: 'Ошибка получения списка участников' });
		}
	}

	async saveMember (req, res) {
		const authToken = req.headers.authorization.split(' ')[1];
		const { id, name, roblox } = req.body;

		if (!authToken) {
			return res.status(401).json({ error: 'Пользователь не авторизован' });
		}

		try {
			const decodedData = jwt.verify(authToken, secret);

			const role = await Role.findOne({ _id: decodedData.roles });

			if (role.value == 'USER' || role.value == 'SPECTATOR') {
				return res.status(403).json({ error: 'Доступ запрещен' });
			}

			const member = new Member({
				id: id,
				name: name,
				roblox: roblox
			});

			await member.save();

			return res.status(200).json({ message: 'Участник сохранен' });
		} catch (e) {
			console.log(e);
			return res.status(400);
		}
	}

	async deleteMember (req, res) {
		const authToken = req.headers.authorization.split(' ')[1];
		const { id } = req.body;

		if (!authToken) {
			return res.status(401).json({ error: 'Пользователь не авторизован' });
		}

		try {
			const decodedData = jwt.verify(authToken, secret);

			const role = await Role.findOne({ _id: decodedData.roles });

			if (role.value == 'USER' || role.value == 'SPECTATOR') {
				return res.status(403).json({ error: 'Доступ запрещен' });
			}

			await Member.deleteOne({ _id: id });

			return res.status(200).json({ message: 'Участник сохранен' });
		} catch (e) {
			console.log(e);
			return res.status(400);
		}
	}

	async deleteReg (req, res) {
		const authToken = req.headers.authorization.split(' ')[1];
		const { id } = req.body;

		if (!authToken) {
			return res.status(401).json({ error: 'Пользователь не авторизован' });
		}

		try {
			const decodedData = jwt.verify(authToken, secret);

			const role = await Role.findOne({ _id: decodedData.roles });

			if (role.value == 'USER' || role.value == 'SPECTATOR') {
				return res.status(403).json({ error: 'Доступ запрещен' });
			}

			await Report.deleteOne({ _id: id });

			return res.status(200).json({ message: 'Success!' });
		} catch (e) {
			console.log(e);
			return res.status(400).json({ error: 'Ошибка удаления записи реестра.' });
		}
	}
}


module.exports = new apiController()