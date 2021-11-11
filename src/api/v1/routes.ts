import express, { Router } from "express";
import  validate from "./middleware/validateRequest";
import { newUser, userSignIn } from "./schema/user.schema";
import { deleteUserImageHandler, getUserHandler, getUserImagesHandler, imageUploadHandler, newUserHandler } from "./controller/user.controller";
import { tokenMiddleware } from "./middleware/jwtHelper";
import { authenticate, signOffUser } from "./controller/auth.controller";
import multerAwsConfig from "./middleware/s3";
import { imageParams } from "./schema/image.schema";

const router: Router = express.Router();

// Middleware
router.use('/users', tokenMiddleware);

router.post('/registration', validate(newUser), newUserHandler);
router.post('/users/imageUpload', multerAwsConfig.single('image'), imageUploadHandler)
router.get('/users/users/:userId', getUserHandler);
router.get('/users/images', getUserImagesHandler);
router.delete('/users/deleteImage/:imageId', validate(imageParams), deleteUserImageHandler);

// authorization / authentication
router.post('/login',  validate(userSignIn), authenticate);
router.post('/users/logout', signOffUser);

export default router;