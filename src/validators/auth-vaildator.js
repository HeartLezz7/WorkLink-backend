const Joi = require("joi");

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
  verifyStatus: Joi.boolean(),
  isBanned: Joi.boolean(),
  firstName: Joi.string(),
  lastName: Joi.string(),
});

exports.registerSchema = registerSchema;

const loginSchema = Joi.object({
  // email: Joi.string().required(),
  // password: Joi.string().required()

  emailOrPhoneNumber: Joi.alternatives([
    Joi.string().email(),
    Joi.string().pattern(/^[0-9]{10}$/),
  ])
    .required()
    .strip(),
  email: Joi.forbidden().when("emailOrPhoneNumber", {
    is: Joi.string().email(),
    then: Joi.string().default(Joi.ref("emailOrPhoneNumber")),
  }),
  phoneNumber: Joi.forbidden().when("emailOrPhoneNumber", {
    is: Joi.string().pattern(/^[0-9]{10}$/),
    then: Joi.string().default(Joi.ref("emailOrPhoneNumber")),
  }),
  password: Joi.string()
    .pattern(/^[a-zA-Z0-9]{6,30}$/)
    .trim()
    .required(),
});
exports.loginSchema = loginSchema;
