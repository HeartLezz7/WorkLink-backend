const prisma = require("../models/prisma");

exports.createUserProfile = async (req, res, next) => {
  try {
    const value = req.body;
    console.log(value);

    const create = await prisma.userProfile.create({
      data: {
        firstName: value.firstName,
        lastName: value.lastName,
        profileImage: value.profileImage,
        identifyId: value.identifyId,
        identifyImage: value.identifyImage,
        birthDate: value.birthDate + "T00:00:00Z",
        address: value.address,
        personalDescription: value.personalDescription,
        wallet: value.wallet,
        user: {
          connect: {
            id: +value.userId,
          },
        },
      },
      include: {
        user: true,
      },
    });
    res
      .status(201)
      .json({
        message: "Success create userProfile from /user/createprofile",
        create,
      });
  } catch (err) {
    next(err);
  }
};
