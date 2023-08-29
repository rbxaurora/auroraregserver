const User = require(`../models/User`);
const Chat = require(`../models/Chat`);
const Firebase = require(`../firebase/firebase-admin`);

class msgController {
	async regToken (req, res) {
		const { token, userid } = req.body;

		try {
			await User.updateOne({ _id: userid }, { $set: { firebaseToken: token } });

			return res.status(200).json({ message: 'Firebase token was sended successfully!' });
		} catch (e) {
			return res.status(400).json(e);
		}
	}

	async sendNotificationChat (req, res) {
		const { msg, from, chatid } = req.body;

		const chat = await Chat.findOne({ chatId: chatid });

		try {
			const users = await User.find().populate('roles');

			const filter = users.filter(o => o.roles?.value != 'USER');

			for (let i = 0; i <= filter.length; i++) {
				const user = filter[i];

				const message = {
					notification: {
						title: `Новое сообщение в ${chat.chatTitle}`,
						body: `${from}: ${msg.split(0, 70)}...`
					},
					token: user.firebaseToken
				};

				Firebase.sendNotification(message);
			}
		} catch (e) {
			console.log(e);
		}
	}
}


module.exports = new msgController()