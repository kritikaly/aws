import { object, string, ref } from "yup";

export const imageParams = object({
    params: object({
        imageId: string().required("must provide image id")
    })
});