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

function validateAddOperation (operation){
    const operationSchema = joi.object({
        value: joi.number()
            .integer()
            .disallow(0)
            .required(),
        description: joi.string()
            .min(2)
            .required()
    })
    return !!operationSchema.validate(operation).error
}

export {
    validateSignUp,
    validateSignIn,
    validateAddOperation
}