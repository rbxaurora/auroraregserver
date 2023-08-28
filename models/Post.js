const { Schema, model } = require(`mongoose`);

const postSchema = new Schema({
    title: String,
    author: String,
    content: String
}, { timestamps: true });

const Post = model(`post`, postSchema);


module.exports = Post;