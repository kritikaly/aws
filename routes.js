const express = require('express');
const router = express.Router();

// Helper Functions
const jwtHelper = require('./config/jwtHelper');
const awsS3Uploader = require('./config/s3');

// Controllers
const authController = require('./controllers/auth.controller');
const usersController = require('./controllers/users.controller');

// Middleware
// All routes with '/users' will have to pass the tokenMiddleware authentication
// to be granted access to the protected rescource!
router.use('/users', jwtHelper.tokenMiddleware);

// Api
router.post('/registration', usersController.newUser);
router.post('/login', authController.authenticate);
router.post('/logout', jwtHelper.tokenMiddleware, authController.signOffUser);
router.get('/users/user/:id', usersController.getUser);
router.get('/users/images', usersController.getUserImages);

router.post('/users/imageUpload',
awsS3Uploader.multerAws.single('image'), usersController.imageUpload);

module.exports = router;
