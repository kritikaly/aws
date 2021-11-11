import mongoose from "mongoose";
import crypto from "crypto";
import jwt, { SignOptions } from "jsonwebtoken";
import { pathToKeysFunction } from "../../../config/helperFunctions";
import imagesSchema, { ImageDocument } from "./images.model";
import log from "../../../logger";

export interface UserDocument extends mongoose.Document {
    email: string;
    username: string;
    password: string;
    saltSecret?: string;
    images?: [ImageDocument];
    isLoggedIn?: boolean;
    signInTime?: Date | number;
    signOffTime?: Date | number;
    verifyPassword(password: string): Promise<boolean>;
    removeImage(imageToDelete: string): Promise<[]>;
    generateJwt(): Promise<{token: string, expiresIn: number}>
}

const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: "The username cannot be empty!",
            unique: "this username is already taken"
        },
        email: {
            type: String,
            required: [true, 'User must input name to sign in'],
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
    
        images: [imagesSchema]
    }
);

// UserSchema.path('email').validate(function (val) {
//     emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//     return emailRegex.test(val);
// }, 'Invalid e-mail');

UserSchema.methods.verifyPassword = async function (password) {
    let hashVerify = crypto.pbkdf2Sync(password, this.saltSecret, 10000, 64, 'sha512').toString('hex');
    return this.password === hashVerify;
}

UserSchema.methods.removeImage = async function(imageToDelete: string) {
    const newArray = this.images.filter(function(ele: ImageDocument) {
        return ele._id != imageToDelete;
    });
    this.images = newArray;
}

UserSchema.methods.generateJwt = async function() {

    const payload: object = {
        sub: this._id as string,
        // iat: Date.now(),
        // admin: this.admin
    };

    const config: SignOptions = {
        expiresIn: 60 * 15,
        algorithm: 'RS256',
    };
    
    return {
        token: jwt.sign(payload, pathToKeysFunction('private'), config),
        expiresIn: config.expiresIn
    } 
}

const User = mongoose.model<UserDocument>("Users", UserSchema, "Users");

export default User;
