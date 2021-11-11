import { NextFunction, Request, Response } from "express";
import { customErrorHandler, pathToKeysFunction } from "../../../config/helperFunctions";
import jwt, { VerifyOptions } from "jsonwebtoken";
import ExtractJwt from "passport-jwt";
import User, { UserDocument } from "../model/user.model";
import log from "../../../logger";
import { userSignOut } from "../service/user.service";


export async function tokenMiddleware(req: Request, res: Response, next: NextFunction)  {

    let jwtFromRequest =  ExtractJwt.ExtractJwt.fromAuthHeaderAsBearerToken() as any; // make into a custom value that looks into the 'authorization' headers for the token
    let secretOrKey = pathToKeysFunction('public');
    let options: VerifyOptions = {
        algorithms: ['RS256']
    };
    log.info(jwtFromRequest, "incoming token from the headers!!");
    try {

        jwt.verify(jwtFromRequest(req), secretOrKey, options, async (err, decoded) => {

            let errorChecker = customErrorHandler(err, null, jwtFromRequest(req), null, null, next);
            if (decoded && errorChecker) {

                User.findById(decoded.sub, async (err: any, user: UserDocument) => {
                    
                    await customErrorHandler(err, null, user, null, null, next);
                    if (user.isLoggedIn) {
                        
                        next();
                    } else {
                        const error = new Error('User must be logged in first.') as any;
                        error.status = 403;
                        next(error);
                    }
                });
            } else {
                let userId = decoded?.sub;
                await userSignOut(next, userId);
            }
        });
    } catch (error) {
        console.log({error}, 'captured one!!!');
        next(error);
    }

}
