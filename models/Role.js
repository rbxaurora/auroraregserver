const { Schema, model } = require(`mongoose`);

const roleSchema = new Schema({
	value: {
		type: String,
		required: true,
		default: 'USER'
	},
	rolename: {
		type: String
	},
	color: String
});


module.exports = model('Role', roleSchema);