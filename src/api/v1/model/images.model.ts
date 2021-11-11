import mongoose from "mongoose";


export interface ImageDocument extends mongoose.Document {
    fieldname: string,
    originalname: string,
    encoding: string,
    mimetype: string,
    location: string
}


const imagesSchema = new mongoose.Schema(
    {
        fieldname: {
            type: String,
            required: true
        },
        
        originalname: {
            type: String,
            required: true
        },

        encoding: {
            type: String,
            required: true
        },

        mimetype: {
            type: String,
            required: true
        },

        location: {
            type: String,
            required: true
        },
    }
);

export default imagesSchema;