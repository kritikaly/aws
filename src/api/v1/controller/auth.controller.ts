import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ExtractJwt } from "passport-jwt";
import { userSignIn, userSignOut } from "../service/user.service";

export async function authenticate(req: Request, res: Response, next: NextFunction) {
    try {
        
        const { email, password } = req.body;
        const signedIn = await userSignIn(email, password, next);
        res.status(200).json(signedIn);
    } catch (error) {
        console.log({error}, 'captured error from sign in function');
        next(error);
    }
}

export async function signOffUser(req: Request, res: Response, next: NextFunction) {
    try {
        
        let jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken() as any;
        let decodedJwtSub = jwt.decode(jwtFromRequest(req))?.sub as string;
        await userSignOut(next, decodedJwtSub);
        res.status(200).json({"response": "ok"});
        console.log('from the sign out function!!!');
    } catch (error) {
        console.log({error}, 'captured error from sign out function');
        next(error);
    }
}
