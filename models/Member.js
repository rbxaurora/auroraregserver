const { Schema, model } = require(`mongoose`);

const memberSchema = new Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    roblox: {
        type: String,
        required: true,
        unique: true
    }
});

const Member = model('members', memberSchema);


module.exports = Member;