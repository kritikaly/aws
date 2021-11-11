import crypto from "crypto";
import fs from "fs";
import path from "path";
import { Secret } from "jsonwebtoken"
import { NextFunction, Request, Response } from "express";
import log from "../logger";

/** 
 * @param {function} pathToKeysFunction - Function to return either the public or private key stored. 
 * @param {string} publicOrPrivate - Parameter to function `pathToKeysFunction` via `public`, or `private` values.
*/
export function pathToKeysFunction (publicOrPrivate: string): Secret {
    switch (publicOrPrivate) {
      case 'public':
        let publicKeyPath = path.join(__dirname, './', 'id_rsa_pub.pem');
        console.log(publicKeyPath);
        console.log({publicKeyPath}, 'public key selected!!');
        return fs.readFileSync(publicKeyPath, 'utf8');
        break;
    
      case 'private':
        let privateKeyPath = path.join(__dirname, './', 'id_rsa_priv.pem');
        console.log(privateKeyPath);
        console.log({privateKeyPath}, 'private key selected!!');
        return fs.readFileSync(privateKeyPath, 'utf8');
      default:
        return '';
        break;
    }
}

export async function customErrorHandler (
    err: any,
    res: Response | null,
    document: any,
    statusCode: number | null,
    itemToSend: any | null,
    next: NextFunction) {
    // console.log({err}, {document}, 'error was captured!');
    if (err) {
  
      if (err.message === 'jwt expired') {
        
        const error = new Error('jwt expired') as any;
        error.status = 404;
        next(error);
        return false;
      }
  
      // console.log(err.message, 'we have an error happening!!');
        next(err);
        return false;
    } else if (!document){
  
      // console.log('there was no document found, handling error...');
      const error = new Error('No Document') as any;
      error.status = 404;
      next(error);
      return false;
    } else if (!err && (res && statusCode && itemToSend)) {
      console.log('sending off as response!!');
        res.status(statusCode).json({
        "response": itemToSend
      });
      return true;
    } else {
  
      return true;
    }
  }

export async function serverErrorHandler(
    err: any,
    req: Request,
    res: Response,
    next: NextFunction) {

    if (err.name.toString() === 'ValidationError') {
  
      let valErrors = [];
      valErrors.push(err.message);
      Object.keys(err.errors).forEach(key => valErrors.push(err.errors[key].message));
        res.status(406).json(valErrors);
    } else if(err.code == 11000) {
  
        res.status(422).json({"response": 'duplicate email address found.'});
    } else if (err.message === 'No Document') {
  
      log.error('this error handles there being no document!!!');
        res.status(404).json({"response": 'Document not found'});
    } else if (err.message === 'jwt expired') {
  
        res.status(404).json({"response": 'Token expired'});
    } else if (err.kind === "ObjectId") {
  
      log.error( {err}, 'ObjectId was not correct!!!');
      res.status(404).json({"response": 'Invalid Document Id'});
    } else {
  
        log.error({err}, 'an error came into the middleware!!');
        res.status(err.status || 404).json({"response": err.message || 'error'});
    }
}



/**
 * 
 * @param {*} password - The password string that the user inputs to the password field in the register form
 * 
 * This function takes a plain text password and creates a salt and hash out of it.  Instead of storing the plaintext
 * password in the database, the salt and hash are stored for security
 * 
 * ALTERNATIVE: It would also be acceptable to just use a hashing algorithm to make a hash of the plain text password.
 * You would then store the hashed password in the database and then re-hash it to verify later (similar to what we do here)
 */
 export async function hashPasswords (password: string, next?: NextFunction): Promise<{newPassword: string, newSalt: string}> {
  
    // await this.customErrorHandler(null, null, password, null, null, next);
    const salt: string = crypto.randomBytes(32).toString('hex');
    const genHash: string = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    let newPassword = genHash;
    let newSalt = salt;
    return {
      newPassword,
      newSalt
    }
  }