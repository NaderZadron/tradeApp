const mongoose = require('mongoose');
var passportLocalMongoose = require("passport-local-mongoose");

const authSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true 
    },
    password:{
        type: String,
        required: true
    },
    name: String,
    emailAddr: {
        type: String,
        required: true
    }
})

authSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", authSchema);