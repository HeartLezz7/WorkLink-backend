const fs = require("fs/promises");
const prisma = require("../models/prisma");
const { upload } = require("../utils/cloundinary-service");
const createError = require("../utils/create-error");

// hong edit complete
exports.validateUser = async (req, res, next) => {
  try {
    const value = req.body;
    // console.log(value);
    const response = {};
    if (req.file?.path) {
      const url = await upload(req.file.path);
      response.identifyImage = url;
    }
    const user = await prisma.user.update({
      where: {
        id: +req.user.id,
      },
      data: {
        firstName: value.firstName,
        lastName: value.lastName,
        identifyId: value.identifyId,
        identifyImage: response.identifyImage,
        birthDate: value.birthDate + "T00:00:00Z",
        address: value.address,
        authUser: {
          update: {
            where: {
              id: req.user.authUser.id,
            },
            data: {
              phoneNumber: value.phoneNumber,
              verifyStatus: "pending",
            },
          },
        },
      },
      include: {
        authUser: true,
      },
    });
    user.authUser = user.authUser[0];
    delete user.authUser.password;
    res.status(201).json({
      message:
        "Success update userProfile from /user/createprofile must be FormData",
      user,
    });
  } catch (err) {
    next(err);
  } finally {
    if (req.file?.path) {
      fs.unlink(req.file.path);
    }
  }
};
// hong edit complete
exports.getUserProfileById = async (req, res, next) => {
  try {
    const profileData = await prisma.user.findUnique({
      where: {
        id: +req.params.userId,
      },
      include: {
        authUser: {
          select: {
            isBanned: true,
            verifyStatus: true,
          },
        },
      },
    });
    profileData.authUser = profileData.authUser[0];
    res.status(200).json({ profileData });
  } catch (err) {
    next(err);
  }
};
// hong edit complete
exports.updateProfile = async (req, res, next) => {
  try {
    console.log(req.body);

    if (req.file?.path) {
      const url = await upload(req.file.path);

      req.body.profileImage = url;
    }

    const updateProfile = await prisma.user.update({
      where: {
        id: +req.user.id,
      },
      data: req.body,
      include: {
        authUser: true,
      },
    });
    updateProfile.authUser = updateProfile.authUser[0];
    delete updateProfile.authUser.password;

    res.status(200).json({
      message: "Success update user profile /user/editprofile",
      updateProfile,
    });
  } catch (err) {
    next(err);
  } finally {
    if (req.file) {
      fs.unlink(req.file.path);
    }
  }
};

exports.createShowCase = async (req, res, next) => {
  try {
    const value = req.body;
    console.log(req.user);
    const response = {};
    if (req.file) {
      const url = await upload(req.file.path);
      response.imagePicture = url;
    }
    const createCase = await prisma.showCase.create({
      data: {
        imagePicture: response.imagePicture,
        description: value.description,
        userId: req.user.id,
      },
    });
    console.log(createCase);
    res
      .status(201)
      .json({ message: "Success showcase /user/createShowcase", createCase });
  } catch (err) {
    next(err);
  } finally {
    if (req.file) {
      fs.unlink(req.file.path);
    }
  }
};

exports.getAllShowCase = async (req, res, next) => {
  try {
    const getShowCase = await prisma.showCase.findMany({});
    res.status(201).json({ getShowCase });
  } catch (err) {
    next(err);
  }
};

exports.deleteShowCasebyId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const findCaseId = await prisma.showCase.findFirst({
      where: {
        id: +id,
      },
    });
    if (!findCaseId) {
      return next(createError("Sorry do not have this item ID", 400));
    }
    await prisma.showCase.delete({
      where: {
        id: findCaseId.id,
      },
    });
    res.status(200).json({ Message: "Show case Id deleted" });
  } catch (error) {
    next(error);
  }
};

exports.editShowCase = async (req, res, next) => {
  try {
    const { id, description } = req.body;
    if (req.file?.path) {
      // console.log(req.file.path);
      const url = await upload(req.file.path);
      req.body.imagePicture = url;
    }

    const updateShowcase = await prisma.showCase.update({
      where: {
        id: +id,
      },
      data: {
        imagePicture: req.body.imagePicture,
        description,
      },
    });
    res.status(200).json({ message: "Showcase item updated", updateShowcase });
  } catch (error) {
    console.log(error);
    next(error);
  } finally {
    if (req.file) {
      fs.unlink(req.file.path);
    }
  }
};

exports.createReport = async (req, res, next) => {
  try {
    const value = req.body;

    const crateReport = await prisma.report.create({
      data: {
        detail: value.detail,
        workId: value.workId,
        reportById: req.user.userProfile.id,
        reportedId: value.reportedId,
      },
    });
    res.status(201).json({ crateReport });
  } catch (err) {
    next(err);
  }
};

exports.createReview = async (req, res, next) => {
  try {
    const value = req.body;
    const createReview = await prisma.review.create({
      data: {
        rating: value.rating,
        detail: value.detail,
        workId: value.workId,
        reviewerId: req.user.userProfile.id,
        reviewById: value.reviewById,
      },
    });
    res.status(201).json({ createReview });
  } catch (err) {
    next(err);
  }
};

exports.getalluser = async (req, res, next) => {
  try {
    const alluser = await prisma.authUser.findMany({
      where: {
        userType: "user",
      },
      include: {
        user: true,
      },
    });
    res.status(201).json({ alluser });
  } catch (err) {
    next(err);
  }
};

exports.getverifyUser = async (req, res, next) => {
  try {
    const varify = await prisma.authUser.findMany({
      where: {
        verifyStatus: "pending",
      },
      include: {
        user: true,
      },
    });
    res.status(200).json({ varify });
  } catch (error) {
    next(error);
  }
};

exports.getBannedUser = async (req, res, next) => {
  try {
    const isBanned = await prisma.authUser.findMany({
      where: {
        isBanned: true,
      },
      include: {
        user: true,
      },
    });
    res.status(200).json({ isBanned });
  } catch (error) {
    next(error);
  }
};

exports.verifyuser = async (req, res, next) => {
  try {
    const user = req.params;
    const verifyid = await prisma.authUser.update({
      where: {
        id: +user.id,
      },
      data: {
        verifyStatus: "verify",
      },
    });
    res.status(201).json({ verifyid });
  } catch (err) {
    next(err);
  }
};

exports.banuser = async (req, res, next) => {
  try {
    const user = req.params;
    const banid = await prisma.authUser.update({
      where: {
        id: +user.id,
      },
      data: {
        isBanned: true,
      },
    });

    res.status(201).json({ banid });
  } catch (err) {
    next(err);
  }
};

exports.unbanuser = async (req, res, next) => {
  try {
    const user = req.params;
    const unbanid = await prisma.authUser.update({
      where: {
        id: +user.id,
      },
      data: {
        isBanned: false,
      },
    });

    res.status(201).json({ unbanid });
  } catch (err) {
    next(err);
  }
};
