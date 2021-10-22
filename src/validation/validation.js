import joi from "joi";

function validateSignUp (user){
    const singUpSchema = joi.object({
        name: joi.string()
            .min(3)
            .max(40)
            .required(),
        email: joi.string()
            .email()
            .required(),
        password: joi.string()
            .min(6)
            .required()
    })
    return !!singUpSchema.validate(user).error
}

function validateSignIn (user){
    const singInSchema = joi.object({
        email: joi.string()
            .email()
            .required(),
        password: joi.string()
            .min(6)
            .required()
    })
    return !!singInSchema.validate(user).error
}

export {
    validateSignUp,
    validateSignIn
}