const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const helperFunctions = require('../config/helperFunctions');


const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: "The username cannot be empty!",
        unique: "this username is already taken"
    },

    email: {
        type: String,
        required: "User must input name to sign in",
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: [4, "Password must be atleast 4 characters long"]
    },
    saltSecret: String,
    isLoggedIn: {
        type: Boolean,
        required: true,
        default: false
    },
    signInTime: {
        type: mongoose.Schema.Types.Date,
    },
    signOffTime: {
        type: mongoose.Schema.Types.Date,
    },

    images: [{}]
});

UserSchema.path('email').validate(function (val) {
    emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(val);
}, 'Invalid e-mail');

UserSchema.methods.verifyPassword = function (password, hash, salt) {
    let hashVerify = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return hash === hashVerify;
}


UserSchema.methods.generateJwt = function() {

    const payload = {
        sub: this._id,
        // iat: Date.now(),
        // admin: this.admin
    };

    const config = {
        expiresIn: 60 * 15,
        algorithm: 'RS256'
    };

    return {
        token: jwt.sign(payload, helperFunctions.pathToKeysFunction('private'), config),
        expiresIn: config.expiresIn
    } 
}


module.exports = mongoose.model("Users", UserSchema, "Users");