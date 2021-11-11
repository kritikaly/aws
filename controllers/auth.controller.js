const usersController = require('./users.controller');


module.exports.authenticate = async (req, res, next) => {
    try {
        
        await usersController.userSignIn(req.body.email, req.body.password, res, next);
    } catch (error) {
        console.log({error}, 'caught an error');
        next(error);
    }
}

module.exports.signOffUser = async (req, res, next) => {
    try {
        
        await usersController.userSignOut(req._id, res, next);
    } catch (error) {
        console.log({error}, 'caught an error');
        next(error);
    }
}