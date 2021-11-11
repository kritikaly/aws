require('dotenv').config();
import awsS3, { ClientConfiguration } from "aws-sdk/clients/s3";
import multer, { Multer } from "multer";
import multerS3 from "multer-s3";
import log from "../../../logger";

const options: ClientConfiguration = {
    region: process.env.AWS_BUCKET_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
}

const s3 = new awsS3(options);

const multerAwsConfig: Multer = multer({
    storage: multerS3({
        s3,
        bucket: "node-upload-aws",
        acl: 'public-read',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        serverSideEncryption: 'AES256',
        metadata: function(req, file, cb) {
            log.info({file}, 'from the metadata function in multerAws');
            cb(null, Object.assign({}, file));
        },
        key: function(req, file, cb) {
            log.info({file}, 'from the key function in multerAws');
            cb(null, file.originalname);
        }
    })
});

export default multerAwsConfig;
