import { object, string, ref } from "yup";

export const newUser = object({
    body: object({
        username: string().required("Username is required"),
        email: string().email("Must be valid email")
        .required("Email is required!"),
        password: string().required("Password is required!")
        .min(4),
    })
});

export const userSignIn = object({
    body: object({
        email: string().email("Must be valid email")
        .required("Email is required!"),
        password: string().required("Password is required!")
        .min(4)
    })
});

