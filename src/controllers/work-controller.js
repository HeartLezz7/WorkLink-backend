const {
  STATUS_WORK_ADMINREVIEW,
  STATUS_WORK_FINDING,
  STATUS_WORK_CANCEL,
} = require("../configs/constants");
const prisma = require("../models/prisma");
const fs = require("fs/promises");
const { upload } = require("../utils/cloundinary-service");
const createError = require("../utils/create-error");

exports.createWork = async (req, res, next) => {
  try {
    const data = req.body;

    if (req.file?.path) {
      const url = await upload(req.file.path);
      data.workImage = url;
    }
    const createWork = await prisma.work.create({
      data: {
        title: data.title,
        description: data.description,
        price: +data.price,
        addressLat: data.addressLat,
        addressLong: data.addressLong,
        startDate: data.startDate + "T00:00:00Z",
        endDate: data.endDate + "T00:00:00Z",
        statusWork: STATUS_WORK_ADMINREVIEW,
        ownerId: req.user.id,
        categoryId: +data.categoryId,
        workImage: data.workImage,
      },
    });
    res.status(201).json({ createWork });
  } catch (err) {
    next(err);
  } finally {
    if (req.file?.path) {
      fs.unlink(req.file.path);
    }
  }
};

exports.getAllWork = async (req, res, next) => {
  try {
    const allWork = await prisma.work.findMany({
      include: {
        challenger: true,
        category: true,
      },
      orderBy: {},
    });
    res.status(201).json({ allWork });
  } catch (err) {
    next(err);
  }
};

exports.getDelegatedWorkById = async (req, res, next) => {
  try {
    const { workId } = req.params;
    const work = await prisma.work.findUnique({
      where: {
        id: +workId,
      },
      include: {
        challenger: {
          include: {
            user: true,
          },
        },
        category: true,
        chatRoom: true,
        report: true,
        transaction: true,
        review: true,
      },
    });
    res.status(201).json({ work });
  } catch (err) {
    next(err);
  }
};

exports.deleteWork = async (req, res, next) => {
  try {
    const deleteWork = await prisma.work.delete({
      where: {
        id: +req.params.id,
      },
    });
    res.status(201).json({ message: `Delete ${deleteWork} Success` });
  } catch (err) {
    next(err);
  }
};

exports.createworkCategories = async (req, res, next) => {
  try {
    const value = req.body;
    console.log(value);
    const workCategories = await prisma.workCategories.create({
      data: {
        category: value.category,
      },
    });
    res.status(201).json({ workCategories });
  } catch (error) {
    next(error);
  }
};

exports.getAllCategories = async (req, res, next) => {
  try {
    const allCategories = await prisma.workCategories.findMany({});
    console.log(allCategories);
    res.status(201).json({ allCategories });
  } catch (error) {
    next(error);
  }
};

exports.createChallenger = async (req, res, next) => {
  try {
    const { workId } = req.params;
    const findWorkid = await prisma.challenger.findFirst({
      where: {
        AND: { workId: +workId, userId: req.user.id },
      },
    });

    if (findWorkid) {
      return next(createError("You have Submit this workID"));
    }

    const createChallenger = await prisma.challenger.create({
      data: {
        workId: workId,
        userId: req.user.id,
      },
    });
    res.status(200).json({
      Message: "Success Create Challenger /work/challenger/:workid",
      createChallenger,
    });
  } catch (error) {
    next(error);
  }
};

exports.waitingreview = async (req, res, next) => {
  try {
    const reviewWork = await prisma.work.findMany({
      where: {
        statusWork: STATUS_WORK_ADMINREVIEW,
      },
      include: {
        challenger: true,
        category: true,
      },
    });
    res.status(201).json({ reviewWork });
  } catch (err) {
    next(err);
  }
};

exports.updatereview = async (req, res, next) => {
  try {
    const work = req.params;
    const reviewed = await prisma.work.update({
      where: {
        id: +work.id,
      },
      data: {
        statusWork: STATUS_WORK_FINDING,
      },
    });
    res.status(201).json({ reviewed });
  } catch (err) {
    next(err);
  }
};

exports.rejectwork = async (req, res, next) => {
  try {
    const work = req.params;
    const rejectwork = await prisma.work.update({
      where: {
        id: +work.id,
      },
      data: {
        statusWork: STATUS_WORK_CANCEL,
      },
    });
    res.status(201).json({ rejectwork });
  } catch (err) {
    next(err);
  }
};

exports.updateStatusWork = async (req, res, next) => {
  try {
    const status = req.body.status;
    console.log(status);
    res.status(201).json({ status });
  } catch (err) {
    next(err);
  }
};
