import joi from "joi";

function validateUser (user){
    const userSchema = joi.object({
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

    return !!userSchema.validate(user).error
}

export {
    validateUser
}