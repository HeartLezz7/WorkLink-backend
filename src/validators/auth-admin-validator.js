const Joi = require("joi")

const registerSchema = Joi.object({
    email:Joi.string().email().required(),
    password :Joi.string()
    .pattern(/^[a-zA-Z0-9]{6,30}$/)
    .trim()
    .required(),
    phoneNumber :Joi.string().pattern(/^[0-9]{10}$/).required(),
    confirmPassword : Joi.string().valid(Joi.ref('password')).trim().required().strip(),
    userType:Joi.string(),
    isVerify:Joi.boolean(),
    isBanned:Joi.boolean()

})

exports.registerSchema = registerSchema

const loginSchema = Joi.object({
    emailOrPhoneNumber : Joi.alternatives([
        Joi.string().email(),
        Joi.string().pattern(/^[0-9]{10}$/).required()])       
    .required()
    .strip(),
    email : Joi.forbidden()
    .when('emailOrPhoneNumber',{
        is:Joi.string().email(),
        then:Joi.string().default(Joi.ref('emailOrPhoneNumber'))
    }),
    phoneNumber :Joi.forbidden()
    .when('emailOrPhoneNumber',{
        is: Joi.string().pattern(/^[0-9]{10}$/),
        then:Joi.string().default(Joi.ref('emailOrPhoneNumber'))
    }),
    password:Joi.string().required()


})
   
  
  exports.loginSchema = loginSchema


