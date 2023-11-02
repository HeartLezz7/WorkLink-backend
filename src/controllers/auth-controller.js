const { registerSchema, loginSchema } = require("../validators/auth-vaildator");
const jwt = require("jsonwebtoken");
const prisma = require("../models/prisma");
const validator = require("../validators/validate-schema");
const bcrypt = require("bcryptjs");
const createError = require("../utils/create-error");

exports.register = async (req, res, next) => {
  try {
    const { value, error } = registerSchema.validate(req.body);
    if (error) {
      error.statusCode = 400;
      return next(error);
    }

    value.password = await bcrypt.hash(value.password, 12);
    value.isVerify = false;
    value.isBanned = false;

    const user = await prisma.user.create({
      data: {
        email:value.email,
        password:value.password,
        phoneNumber:value.phoneNumber,
        isVerify:value.isVerify,
        isBanned:value.isBanned
      }
    });

    const create = await prisma.userProfile.create({
      data: {
        firstName: value.firstName,
        lastName: value.lastName,
        user: {
          connect: {
            id: +user.id,
          },
        },
      },
      include: {
        user: true,
      },
    });


    const payload = { userId: user.id };
    const accessToken = jwt.sign(
      payload,
      process.env.JWT_SECRET_KEY || "asdfghjklmnbvcxzqwe",
      { expiresIn: process.env.JWT_EXPIRE }
    );

    delete user.password;
    
   
    res.status(201).json({ accessToken, user,create });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const value = validator(loginSchema, req.body, 401);

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: value.email }, { phoneNumber: value.phoneNumber }],
      },
    });

    if (!user) {
      return next(createError("invalid credential", 400));
    }
    const isMatch = await bcrypt.compare(value.password, user.password);
    if (!isMatch) {
      return next(createError("invalid credential", 400));
    }
    const payload = { userId: user.id };
    const accessToken = jwt.sign(
      payload,
      process.env.JWT_SECRET_KEY || "asdfghjkloiuytrrewq",
      { expiresIn: process.env.JWT_EXPIRE }
    );
    res.status(200).json({ accessToken, user });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.getMe = async (req, res, next) => {
  res.status(200).json({ user: req.user });
};
