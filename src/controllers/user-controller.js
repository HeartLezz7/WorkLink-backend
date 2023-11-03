const fs = require("fs/promises");
const prisma = require("../models/prisma");
const { upload } = require("../utils/cloundinary-service");
const { response } = require("express");

exports.validateProfile = async (req, res, next) => {
  try {
    const value = req.body;
    const response = {};
    if (req.file.path) {
      const url = await upload(req.file.path);
      response.identifyImage = url;
    }
    const validateProfile = await prisma.userProfile.update({
      where: {
        id: +req.user.userProfile.id,
      },
      data: {
        firstName: value.firstName,
        lastName: value.lastName,
        identifyId: value.identifyId,
        identifyImage: response.identifyImage,
        birthDate: value.birthDate + "T00:00:00Z",
        address: value.address,
        userId: +value.userId,
      },
      include: {
        user: true,
      },
    });
    res.status(201).json({
      message:
        "Success update userProfile from /user/createprofile must be FormData",
      validateProfile,
    });
  } catch (err) {
    next(err);
  } finally {
    if (req.file.path) {
      fs.unlink(req.file.path);
    }
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    console.log(req.user.userProfile)
    console.log(req.body)
    const {firstName , lastName , address ,personalDescription} = req.body
    const response = {};

    if (req.file.path) {
      const url = await upload(req.file.path);
      response.profileImage = url;
    }

      const updateProfile = await prisma.UserProfile.update({
        data: {
          firstName,
          lastName,
          address,
          personalDescription,
          profileImage: response.profileImage,
        },
        where: {
          id: +req.user.userProfile.id,
        },
      });
    
    res.status(200).json({ message:"Success update user profile /user/editprofile",updateProfile });
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
    const response = {};
    if (req.file) {
      const url = await upload(req.file.path);
      response.imagePictue = url;
    }
    const createCase = await prisma.showCase.create({
      data: {
        imagePictue: response.imagePictue,
        description: value.description,
        userProfileId: req.user.userProfile.id,
      },
    });
    res.status(201).json({ createCase });
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
