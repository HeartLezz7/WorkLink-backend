const { registerSchema, loginSchema } = require("../validators/auth-vaildator");
const jwt = require("jsonwebtoken");
const prisma = require("../models/prisma");
const validator = require("../validators/validate-schema");
const bcrypt = require("bcryptjs");
const createError = require("../utils/create-error");

// hong edit complete
exports.register = async (req, res, next) => {
  try {
    const { value, error } = registerSchema.validate(req.body);
    if (error) {
      error.statusCode = 400;
      return next(error);
    }

    value.password = await bcrypt.hash(value.password, 12);
    value.profileImage =
      "https://res.cloudinary.com/dgtfci0ku/image/upload/v1698914919/rzlbsqmochzva454ttiq.jpg";

    const user = await prisma.user.create({
      data: {
        firstName: value.firstName,
        lastName: value.lastName,
        profileImage: value.profileImage,
        authUser: {
          create: {
            email: value.email,
            password: value.password,
            phoneNumber: value.phoneNumber,
          },
        },
      },
      include: {
        authUser: true,
      },
    });
    console.log(user);

    const payload = { userId: user.id };
    const accessToken = jwt.sign(
      payload,
      process.env.JWT_SECRET_KEY || "asdfghjklmnbvcxzqwe",
      { expiresIn: process.env.JWT_EXPIRE }
    );

    user.authUser = user.authUser[0];

    delete user.authUser.password;

    res.status(201).json({ accessToken, user });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// hong edit complete
exports.login = async (req, res, next) => {
  try {
    const value = validator(loginSchema, req.body, 401);

    const authUser = await prisma.authUser.findFirst({
      where: {
        OR: [{ email: value.email }, { phoneNumber: value.phoneNumber }],
      },
    });

    if (!authUser) {
      return next(createError("invalid credential", 400));
    }
    const isMatch = await bcrypt.compare(value.password, authUser.password);
    if (!isMatch) {
      return next(createError("invalid credential", 400));
    }

    const user = await prisma.user.findUnique({
      where: {
        id: authUser.userId,
      },
      include: {
        authUser: true,
      },
    });
    const payload = { userId: user.id };
    const accessToken = jwt.sign(
      payload,
      process.env.JWT_SECRET_KEY || "asdfghjkloiuytrrewq",
      { expiresIn: process.env.JWT_EXPIRE }
    );
    user.authUser = user.authUser[0];
    delete user.authUser.password;
    res.status(200).json({ accessToken, user });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// hong edit complete
exports.getMe = async (req, res, next) => {
  res.status(200).json({ user: req.user });
};
