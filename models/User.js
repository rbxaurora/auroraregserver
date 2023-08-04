const { Schema, model } = require(`mongoose`);

const userSchema = new Schema({
	username: {
		type: String,
		required: true,
		unique: true
	},
	usernick: {
		type: String
	},
	password: {
		type: String,
		required: true
	},
	roles: {
		type: Schema.Types.ObjectId,
		ref: 'Role'
	}
});


module.exports = model('User', userSchema);