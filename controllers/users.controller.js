const events = require('events');
const Users = require("../schemas/user.model");
const helperFunctions = require("../config/helperFunctions");

/** 
 *@param {function} newUser - `body: {
    username: string,
    email: string,
    password: string,
    image: string
 }` 
*/
module.exports.newUser = async (req, res, next) => {
    try {

        const password = await helperFunctions.hashPasswords(req.body.password, next);
        let newUser = await new Users({
            username: req.body.username,
            email: req.body.email,
            password: password.newPassword,
            saltSecret: password.newSalt
        }).save();
        res.status(201).json({"response": newUser});
    } catch (error) {
        console.log(error);
        next(error);
    }
}

/** 
 *@param {function} getUser - `/:id` Param should hold ObjectId of the user to query.
*/
module.exports.getUser = async (req, res, next) => {
    try {
        
        const user = await Users.findById(req.params.id);
        res.status(200).json({"response": user});
    } catch (error) {
        console.log({error}, 'captured one!!!');
        await next(error);
    }
}

/** 
 *@param {mongoose.Types.ObjectId} userId - Param should hold ObjectId of the user.
 *@param {Response} res - Param should hold the server response value.
 *@param {function} next - Pass next function for improved error handling.
*/
module.exports.userSignOut = async (userId, res, next) => {

    try {
    
        const user = await Users.findById(userId);
        if (user && user.isLoggedIn) {
            user.isLoggedIn = false;
            user.signOffTime = Date.now();
            await user.save();
        } else {
            const error = new Error('User must be logged in first.');
            error.status = 403;
            await next(error);
        }
    } catch (error) {
        console.log(error, 'caught in sign out function');
        await next(error);
    }
}

/** 
 *@param {string} email - Property should hold email of user (from body).
 *@param {string} password - Property should hold password of user (from body).
 *@param {Response} res - Param should hold the server response value.
 *@param {function} next - Pass next function for improved error handling.
*/
module.exports.userSignIn = async (email, password, res, next) => {
    try {
        
        let user = await Users.findOne({email});
        let passwordValid = await user.verifyPassword(password, user.password, user.saltSecret);
        if (user && passwordValid) {
            const token = await user.generateJwt();
            user.isLoggedIn = true;
            user.signInTime = Date.now();
            await user.save();
            res.status(200).json({user, token});
        } else {
            const err = new Error('Document not found');
            err.status = 404;
            await next(err);
        }
    } catch (error) {
        console.log({error}, 'captured error from sign in function');
        await next(error);
    }
}

module.exports.imageUpload = async (req, res, next) => {
    try {
        
        let user = await Users.findById(req._id);
        if (user) {
            req.file.metadata.location = req.file.location;
            console.log(req.file, 'what is in the request!?!?!?');
            user.images.push(req.file.metadata);
            await user.save();
            res.status(200).json({"fileList": user.images});
        }
    } catch (error) {
        console.log({error}, 'captured error from image upload function');
        await next(error);
    }
}

module.exports.getUserImages = async (req, res, next) => {
    try {
        
        let user = await Users.findById(req._id);
        res.status(200).json(user.images);
    } catch (error) {
        console.log({error}, 'captured error from get user images function');
        await next(error);
    }
}
