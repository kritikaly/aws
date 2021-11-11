const jwt = require('jsonwebtoken');
const ExtractJwt = require ('passport-jwt').ExtractJwt;
const Users = require('../schemas/user.model');
const utilFunctions = require('./helperFunctions');
const usersController = require('../controllers/users.controller');


module.exports.tokenMiddleware = async (req, res, next) => {

    let jwtFromRequest =  ExtractJwt.fromAuthHeaderAsBearerToken(); // make into a custom value that looks into the 'authorization' headers for the token
    let secretOrKey = utilFunctions.pathToKeysFunction('private');
    let algorithms = ['RS256'];

    try {

        jwt.verify(jwtFromRequest(req), secretOrKey, {algorithms}, async (err, decoded) => {
            // utilFunctions.customErrorHandler(err, res, jwtFromRequest(req), null, null, next);
            let errorChecker = await utilFunctions.customErrorHandler(err, null, jwtFromRequest(req), null, null, next);
            if (decoded && errorChecker) {

                Users.findById(decoded.sub, async (err, user) => {
                    
                    await utilFunctions.customErrorHandler(err, null, user, null, null, next);
                    if (user.isLoggedIn) {
                        
                        req._id = decoded.sub;
                        next();
                    } else {
                        const error = new Error('User must be logged in first.');
                        error.status = 403;
                        // throw(error);
                        next(error);
                    }
                });
            } else {
                let decodedJwt = jwt.decode(jwtFromRequest(req));
                usersController.userSignOut(decodedJwt.sub, null, next);
            }
        });
    } catch (error) {
        console.log({error}, 'captured one!!!');
        next(error);
    }

}
