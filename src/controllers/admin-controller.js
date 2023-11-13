const {
  registerSchema,
  loginSchema,
} = require("../validators/auth-admin-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../models/prisma");
const createError = require("../utils/create-error");
const validator = require("../validators/validate-schema");
const { userType } = require("@prisma/client");
const { TRANSACTIONSTATUS_APPROVE } = require('../configs/constants')

exports.register = async (req, res, next) => {
  try {
    const { value, error } = registerSchema.validate(req.body);
    if (error) {
      error.statusCode = 400;
      return next(error);
    }

    if (value.adminKey != process.env.SECRET_ADMIN) {
      return next(error);
    }

    value.password = await bcrypt.hash(value.password, 12);
    value.profileImage =
      "https://res.cloudinary.com/dgtfci0ku/image/upload/v1698914919/rzlbsqmochzva454ttiq.jpg";

    const createAdmin = await prisma.user.create({
      data: {
        firstName: value.firstName,
        lastName: value.lastName,
        profileImage: value.profileImage,
        authUser: {
          create: {
            email: value.email,
            password: value.password,
            phoneNumber: value.phoneNumber,
            verifyStatus: "verify",
            userType: "admin",
          },
        },
      },
      include: {
        authUser: true,
      },
    });
    console.log(createAdmin);

    const payload = { userId: createAdmin.id };
    const accessToken = jwt.sign(
      payload,
      process.env.JWT_SECRET_KEY || "asdfghjklmnbvcxzqwe",
      { expiresIn: process.env.JWT_EXPIRE }
    );

    createAdmin.authUser = createAdmin.authUser[0];

    delete createAdmin.authUser.password;

    res.status(201).json({ accessToken, createAdmin });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

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

    const admin = await prisma.user.findUnique({
      where: {
        id: authUser.userId,
      },
      include: {
        authUser: true,
      },
    });
    const payload = { userId: admin.id };
    const accessToken = jwt.sign(
      payload,
      process.env.JWT_SECRET_KEY || "asdfghjkloiuytrrewq",
      { expiresIn: process.env.JWT_EXPIRE }
    );
    admin.authUser = admin.authUser[0];
    delete admin.authUser.password;
    res.status(200).json({ accessToken, admin });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.withdrawCheck = async (req, res, next) => {
  console.log('xxxxxxx');
  try {

    const value = req.body
    const findTransaction = await prisma.transaction.create({
      data: {
        type: value.Type,
        amount: value.Amount,
        status: TRANSACTIONSTATUS_APPROVE,
        userId: value.id
      }
    })

    console.log(findTransaction);
    res.status(200).json({ MSG: "OK", findTransaction })

    // if (findTransaction) {
    //   await prisma.transaction.update({
    //     where: {

    //     }
    //   })
    // }


  } catch (error) {
    console.log(error);
  }
}