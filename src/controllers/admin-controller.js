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

exports.register = async (req, res, next) => {
  try {
    const adminRegister = validator(registerSchema, req.body, 401);

    adminRegister.password = await bcrypt.hash(adminRegister.password, 10);

    if (adminRegister.adminKey === process.env.SECRET_ADMIN) {
      adminRegister.userType = "admin";
    }
    console.log(adminRegister);
    if (adminRegister.userType === "admin") {
      adminRegister.verifyStatus = true;
    }
    const createAdmin = await prisma.User.create({
      data: {
        email: adminRegister.email,
        password: adminRegister.password,
        phoneNumber: adminRegister.phoneNumber,
        userType: adminRegister.userType,
        verifyStatus: adminRegister.verifyStatus,
        isBanned: false,
      },
    });

    console.log(createAdmin.id);

    const payload = { adminId: createAdmin.id };
    const accessToken = jwt.sign(
      payload,
      process.env.JWT_SECRET_KEY || "DefaultRandom",
      { expiresIn: process.env.JWT_EXPIRE }
    );

    console.log(accessToken);

    delete createAdmin.password;
    console.log(`log After Delete Password`, createAdmin);

    res.status(200).json({
      message: "success Register From /admin/register res createAdmin ",
      createAdmin,
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const adminLogin = validator(loginSchema, req.body, 401);
    console.log(adminLogin);

    const findAdminLogin = await prisma.User.findFirst({
      where: {
        OR: [
          { email: adminLogin.email },
          { phoneNumber: adminLogin.phoneNumber },
        ],
      },
    });
    console.log(findAdminLogin);

    if (!findAdminLogin) {
      return next(createError("Invalid credential Email ", 400));
    }
    const isMatch = await bcrypt.compare(
      adminLogin.password,
      findAdminLogin.password
    );

    if (!isMatch) {
      return next(createError("Invalid credential Password", 400));
    }

    const payload = { adminId: findAdminLogin.id };

    const accessToken = jwt.sign(
      payload,
      process.env.JWT_SECRET_KEY || "DefaultRandom",
      { expiresIn: process.env.JWT_EXPIRE }
    );

    delete findAdminLogin.password;

    res.status(200).json({
      message: "success emailOrPhoneNumber Login From /admin/login",
      findAdminLogin,
    });
  } catch (err) {
    next(err);
  }
};

exports.withdrawCheck = async (req, res, next) => {
  try {
    console.log(req.body);
    const { id, status } = req.body
    console.log(id);
    console.log(status);
    const findTransaction = await prisma.Transaction.findFirst({
      where: {
        id
      }
    })
    console.log(findTransaction);


  } catch (error) {
    console.log(error);
  }
}