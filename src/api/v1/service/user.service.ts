import { DocumentDefinition, FilterQuery } from "mongoose";
import User, { UserDocument } from "../model/user.model";
import { hashPasswords } from "../../../config/helperFunctions";
import { NextFunction, } from "express";
import log from "../../../logger";


export async function createUser(input: DocumentDefinition<UserDocument>) {
    try {
        
        const password = await hashPasswords(input.password);
        input.password = password.newPassword;
        input.saltSecret = password.newSalt;
        return await User.create(input);
    } catch (error: any) {
        throw new Error(error);
    }
}

export async function getUser(userId: string) {
    try {
        
        return await User.findById(userId);
    } catch (error: any) {
        throw new Error(error);
    }
}

export async function findUser(query: FilterQuery<UserDocument>) {
    return User.findOne(query).lean();
}

export async function getUserImages(userId: string, next: NextFunction) {
    try {
        
        const user = await User.findById(userId);
        return user?.images;
    } catch (error) {
        console.log(error, 'caught in image upload function');
        next(error);
    }
}

export async function imageUpload(userId: string, file: any, next: NextFunction) {
    try {
        
        const user = await User.findById(userId);
        if (user) {
            file.metadata.location = file.location;
            user.images?.push(file.metadata);
            await user.save();
            return user.images;
        }
    } catch (error) {
        console.log(error, 'caught in image upload function');
        next(error);
    }
}

export async function deleteImage(userId: string, imageId: string, next: NextFunction) {
    try {
        
        const user = await User.findById(userId);
        if (user) {
            // log.info(imageOfInterest, 'should hold image info');
            await user.removeImage(imageId);
            await user.save();
            return user.images;
        }
    } catch (error) {
        console.log(error, 'caught in image upload function');
        next(error);
    }
}


/** 
 *@param {string} userId - Param should hold ObjectId of the user.
 *@param {NextFunction} next - Pass next function for improved error handling.
*/
export async function userSignOut(next: NextFunction, userId?: string,) {
    try {
    
        const user = await User.findById(userId);
        if (user && user.isLoggedIn) {
            user.isLoggedIn = false;
            user.signOffTime = Date.now();
            await user.save();
        } else {
            const error = new Error('User must be logged in first.');
            // error.status(403);
            next(error);
        }
    } catch (error) {
        console.log(error, 'caught in sign out function');
        next(error);
    }
}

/** 
 *@param {string} email - Property should hold email of user (from body).
 *@param {string} password - Property should hold password of user (from body).
 *@param {NextFunction} next - Pass next function for improved error handling.
*/
export async function userSignIn(
    email: string,
    password: string,
    next: NextFunction): Promise<{user: UserDocument, token: {token: string, expiresIn: number}} | undefined> {
    try {
        
        let user = await User.findOne({email});
        let passwordValid = await user?.verifyPassword(password);
        if (user && passwordValid) {
            const token = await user.generateJwt();
            user.isLoggedIn = true;
            user.signInTime = Date.now();
            await user.save();
            return {user, token};
        } else {
            const err = new Error('Document not found') as any;
            err.status = 404;
            next(err);
        }
    } catch (error) {
        console.log({error}, 'captured error from sign in function');
        next(error);
    }
}