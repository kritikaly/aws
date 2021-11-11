require('dotenv').config();
const awsS3 = require('aws-sdk/clients/s3');
const multer = require('multer');
const multerS3 = require('multer-s3');
const fs = require('fs');

const options = {
    region: process.env.AWS_BUCKET_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY
}

const s3 = new awsS3(options);

module.exports.multerAws = multer({
    storage: multerS3({
        s3,
        bucket: process.env.AWS_BUCKET_NAME,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        metadata: function(req, file, cb) {
            console.log(file, 'from the metadata function in multerAws');
            cb(null, Object.assign({}, file));
        },
        key: function(req, file, cb) {
            console.log(file, 'from the key function in multerAws');
            cb(null, file.originalname);
        }
    })
});

module.exports.fileUpload = async (file) => {
    const fileStream = fs.createReadStream(file.path);

    const uploadParams = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Body: fileStream,
        key: file.filename
    }

    return s3.upload(uploadParams).promise();
}
