const { Schema, model } = require(`mongoose`);

const chatSchema = new Schema ({
	chatId: {
		type: Number,
		required: true,
		unique: true
	},
	chatTitle: {
		type: String,
		required: true
	},
	chatMessages: [{
		type: Object
	}],
	chatMembers: [{
		type: Object
	}]
}, { timestamps: true });

const Chat = model(`chat`, chatSchema, 'chatList');


module.exports = Chat;