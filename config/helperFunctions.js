const crypto = require('crypto');
const fs = require('fs');
const path = require('path');


/**
 * 
 * @param {*} password - The plain text password
 * @param {*} hash - The hash stored in the database
 * @param {*} salt - The salt stored in the database
 * 
 * This function uses the crypto library to decrypt the hash using the salt and then compares
 * the decrypted hash/salt with the password that the user provided at login
 */
 function validPassword(password, hash, salt) {
    var hashVerify = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return hash === hashVerify;
}

/** 
 * @param {function} pathToKeysFunction - Function to return either the public or private key stored. 
 * @param {string} publicOrPrivate - Parameter to function `pathToKeysFunction` via `public`, or `private` values.
*/
module.exports.pathToKeysFunction = (publicOrPrivate) => {
    switch (publicOrPrivate) {
      case 'public':
        let publicKeyPath = path.join(__dirname, './', 'id_rsa_pub.pem');
        console.log(publicKeyPath);
        // console.log({publicKeyPath}, 'public key selected!!');
        return fs.readFileSync(publicKeyPath, 'utf8');
        break;
    
      case 'private':
        let privateKeyPath = path.join(__dirname, './', 'id_rsa_priv.pem');
        console.log(privateKeyPath);
        // console.log({privateKeyPath}, 'private key selected!!');
        return fs.readFileSync(privateKeyPath, 'utf8');
      default:
        return console.log('Invalid input. Try either, "public", or "private" as params for the function');
        break;
    }
}

module.exports.customErrorHandler = async (err, res, document, statusCode, itemToSend, next) => {
    // console.log({err}, {document}, 'error was captured!');
    if (err) {
  
      if (err.message === 'jwt expired') {
        
        const error = new Error('jwt expired');
        error.status = 404;
        await next(error);
        return false;
      }
  
      // console.log(err.message, 'we have an error happening!!');
      await next(err);
      return false;
    } else if (!document){
  
      // console.log('there was no document found, handling error...');
      const error = new Error('No Document');
      error.status = 404;
      await next(error);
      return false;
    } else if (!err && (res && statusCode && itemToSend)) {
      console.log('sending off as response!!');
      await res.status(statusCode).json({
        "response": itemToSend
      });
      return true;
    } else {
  
      return true;
    }
  }

module.exports.serverErrorHandler = async function(err, req, res, next) {

    if (err.name.toString() === 'ValidationError') {
  
      let valErrors = [];
      valErrors.push(err.message);
      Object.keys(err.errors).forEach(key => valErrors.push(err.errors[key].message));
      await res.status(406).json(valErrors);
    } else if(err.code == 11000) {
  
      await res.status(422).json({"response": 'duplicate email address found.'});
    } else if (err.message === 'No Document') {
  
      console.log('this error handles there being no document!!!');
      await res.status(404).json({"response": 'Document not found'});
    } else if (err.message === 'jwt expired') {
  
      await res.status(404).json({"response": 'Token expired'});
    } else if (err.kind === "ObjectId") {
  
      console.log( {err}, 'ObjectId was not correct!!!');
      res.status(404).json({"response": 'Invalid Document Id'});
    } else {
  
        // console.log({err}, 'an error came into the middleware!!');
        await res.status(err.status || 404).json({"response": err.message || 'error'});
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
 module.exports.hashPasswords = async (password, next) => {
  
    await this.customErrorHandler(null, null, password, null, null, next);
    const salt = crypto.randomBytes(32).toString('hex');
    const genHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    let newPassword = genHash;
    let newSalt = salt;
    return {
      newPassword,
      newSalt
    }
  }