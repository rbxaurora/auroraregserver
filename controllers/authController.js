const User = require(`../models/User`);
const Role = require(`../models/Role`);
const bcrypt = require(`bcryptjs`);
const { validationResult } = require(`express-validator`);
const jwt = require(`jsonwebtoken`);
const { secret } = require(`../config.js`);

const generateAccessToken = (id, roles) => {
	const payload = {
		id,
		roles
	}
	return jwt.sign(payload, secret, {
		expiresIn: '24h'
	});
}

class authController {
	async login (req, res) {
		try {
			const { username, password } = req.body;
			const user = await User.findOne({username});

			if (!user) {
				return res.status(400).json({ message: `Пользователь ${username} не существует!` });
			}

			const validPass = bcrypt.compareSync(password, user.password);

			if (!validPass) {
				return res.status(400).json({ message: `Пароль введен неверно!` });
			}

			const token = generateAccessToken(user._id, user.roles);

			return res.status(200).json({ token: token })
		} catch (e) {
			console.log(e);
			res.status(400);
		}
	}

	async registration (req, res) {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.status(400).json({ message: 'Ошибка при регистрации', errors });
			}

			const { username, password, usernick } = req.body;
			const candidate = await User.findOne({username});

			if (candidate) {
				return res.status(400).json({ message: 'Пользователь уже существует' });
			}

			const hashPass = bcrypt.hashSync(password, 7);
			const userRole = await Role.findOne({ value: 'USER' });
			const user = new User({ username, usernick, password: hashPass, roles: userRole._id });

			await user.save();

			return res.status(200).json({ message: 'Пользователь зарегистрирован успешно!' });
		} catch (e) {
			console.log(e);
			res.status(400);
		}
	}

	async getUsers (req, res) {
		try {
			const users = await User.find();
			res.json(users);
		} catch (e) {
			console.log(e);
			res.status(400);
		}
	}
}


module.exports = new authController()