import { createUser, deleteImage, getUser, getUserImages, imageUpload } from "../service/user.service";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ExtractJwt } from "passport-jwt";
import log from "../../../logger";


export async function newUserHandler(req: Request, res: Response, next: NextFunction) {
    try {
        const user = await createUser(req.body);
        res.status(201).json({"response": user});
    } catch (error) {
        console.log({error}, 'captured error from new user function');
        next(error);
    }
}

export async function getUserHandler(req: Request, res: Response, next: NextFunction) {
    try {
        
        const user = await getUser(req.params.userId);
        return res.status(200).json({"response": user});
    } catch (error) {
        console.log({error}, 'captured error from get user function');
        next(error);
    }
}

export async function imageUploadHandler(req: Request, res: Response, next: NextFunction) {
    try {
        
        // let file = new FileReader();
        let jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken() as any;
        let decodedJwtSub = jwt.decode(jwtFromRequest(req))?.sub as string;
        let uploadedImages = await imageUpload(decodedJwtSub, req.file, next);
        res.status(200).json(uploadedImages);
    } catch (error) {
        console.log({error}, 'captured error from image uploader function');
        next(error);
    }
}

export async function getUserImagesHandler(req: Request, res: Response, next: NextFunction) {
    try {
        
        const jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken() as any;
        const decodedJwtSub = jwt.decode(jwtFromRequest(req))?.sub as string;
        const userImages = await getUserImages(decodedJwtSub, next);
        res.status(200).json(userImages);
    } catch (error) {
        console.log({error}, 'captured error from get image function');
        next(error);
    }
}

export async function deleteUserImageHandler(req: Request, res: Response, next: NextFunction) {
    try {
        
        const jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken() as any;
        const decodedJwtSub = jwt.decode(jwtFromRequest(req))?.sub as string;
        log.info(req.params, 'should hold image id!!');
        const userImages = await deleteImage(decodedJwtSub, req.params.imageId as string, next);
        res.status(200).json(userImages)
    } catch (error) {
        console.log({error}, 'captured error from delete image function');
        next(error);
    }
}
