
const Joi = require('joi');

const registerSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string()
        .pattern(/^[a-zA-Z0-9]{6,30}$/)
        .trim()
        .required(),
    phoneNumber: Joi.string()
        .allow(null, "")
        .pattern(/^[0-9]{10}$/),
    // confirmPassword: Joi.string().valid(Joi.ref('password')).trim().required().strip(),
    // phoneNumber: Joi.forbidden().when('emailOrphoneNumber', {
    //     is: Joi.string().pattern(/^[0-9]{10}$/),
    //     then: Joi.string().default(Joi.ref('emailOrphoneNumber'))
    // }),
    // email: Joi.forbidden().when('emailOrphoneNumber', {
    //     is: Joi.string().email(),
    //     then: Joi.string().default(Joi.ref('emailOrphoneNumber'))
    // }),
    userType: Joi.string(),
    isVerify: Joi.boolean(),
    isBanned: Joi.boolean()
});

exports.registerSchema = registerSchema;

const loginSchema = Joi.object({
    // email: Joi.string().required(),
    // password: Joi.string().required()

    emailOrphoneNumber: Joi.alternatives([
        Joi.string().email(),
        Joi.string().pattern(/^[0-9]{10}$/)
    ]).required()
        .strip(),
    email: Joi.forbidden()
        .when('emailOrphoneNumber', {
            is: Joi.string().email(),
            then: Joi.string().default(Joi.ref('emailOrphoneNumber'))
        }),
    phoneNumber: Joi.forbidden()
        .when('emailOrphoneNumber', {
            is: Joi.string().pattern(/^[0-9]{10}$/),
            then: Joi.string().default(Joi.ref('emailOrphoneNumber'))
        }),
    password: Joi.string()
        .pattern(/^[a-zA-Z0-9]{6,30}$/)
        .trim()
        .required(),
});
exports.loginSchema = loginSchema;
