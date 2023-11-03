const fs = require("fs/promises");
const prisma = require("../models/prisma");
const { upload } = require("../utils/cloundinary-service");
const { response } = require("express");

exports.createUserProfile = async (req, res, next) => {
  try {
    const value = req.body;
    console.log(value);

    const response = {};
    console.log("FILES", req.files.profileImage[0].path);
    if (req.files.profileImage) {
      const url = await upload(req.files.profileImage[0].path);
      response.profileImage = url;
      console.log("profileImage", response);
    }

    if (req.files.identifyImage) {
      const url = await upload(req.files.identifyImage[0].path);
      response.identifyImage = url;
      console.log("identifyImage", response);
    }

    console.log(response);

    const create = await prisma.userProfile.create({
      data: {
        firstName: value.firstName,
        lastName: value.lastName,
        identifyId: value.identifyId,
        identifyImage: response.identifyImage,
        birthDate: value.birthDate + "T00:00:00Z",
        address: value.address,
        personalDescription: value.personalDescription,
        wallet: value.wallet,
        profileImage: "" + response.profileImage,
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

    res.status(201).json({
      message:
        "Success create userProfile from /user/createprofile must be FormData",
      create,
    });
  } catch (err) {
    next(err);
  } finally {
    if (req.files.profileImage) {
      fs.unlink(req.files.profileImage[0].path);
    }
    if (req.files.identifyImage) {
      fs.unlink(req.files.identifyImage[0].path);
    }
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const response = {};

    if (req.file) {
      const url = await upload(req.file.path);
      response.profileImage = url;

      await prisma.UserProfile.update({
        data: {
          profileImage: response.profileImage,
        },
        where: {
          id: +req.params.id,
        },
      });
    }
    res.status(200).json({ response });
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
    const { value } = req.body;
    const crateReport = await prisma.report.create({
      data: {
        detail: value.detail,
        workId: value.workId,
        reportById: req.uesr.userProfile.id,
        reported: value.reported,
      },
    });
    res.status(201).json({ crateReport });
  } catch (err) {
    next(err);
  }
};
