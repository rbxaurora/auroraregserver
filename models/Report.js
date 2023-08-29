const { Schema, model } = require(`mongoose`);

const reportSchema = new Schema({
    adminLogin: {
        type: String, 
        required: true
    },
    date: {
        type: Schema.Types.Date,
        required: true
    },
    memberList: [{
        type: Object,
        required: true
    }]
}, {
    timestamps: true
});

const Report = model('reports', reportSchema);


module.exports = Report;