const createError = require("../utils/create-error");
const jwt = require("jsonwebtoken");
const prisma = require("../models/prisma");

// hong edit complete
module.exports = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization;
    if (!authorization || !authorization.startsWith("Bearer ")) {
      return next(createError("unauthenticated", 401));
    }

    const token = authorization.split(" ")[1];
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY || "asdfghjkl"
    );

    const user = await prisma.user.findUnique({
      where: {
        id: payload.userId,
      },
      include: {
        authUser: true,
      },
    });
    if (!user) {
      return next(createError("unauthenticated", 401));
    }
    user.authUser = user.authUser[0];
    delete user.authUser.password;
    req.user = user;

    next();
  } catch (error) {
    if (
      error.name === "TokenExpriedError" ||
      error.name === "JsonWebTokenError"
    ) {
      error.statusCode = 401;
    }
    next(error);
  }
};
