const mongoose = require('mongoose')
const User = require('./auth');

const postSchema = new mongoose.Schema({
    image: {
        type: String
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    tradeFor: {
        type: String, 
        required: true
    },
    createdAt: { type: Date, default: Date.now },
    author: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
    },
    offers: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Post',
          unique: true,
          default: []
        },
      ],
})

const Post = mongoose.model('Post', postSchema);
module.exports = Post;