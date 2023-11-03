const { STATUS_WORK_CREATE } = require("../configs/constants");
const prisma = require("../models/prisma");

exports.createWork = async (req, res, next) => {
  try {
    const data = req.body;
    console.log(data);
    const createWork = await prisma.work.create({
      data: {
        title: data.title,
        description: data.description,
        price: data.price,
        addressLat: data.addressLat,
        addressLong: data.addressLong,
        startDate: data.startDate + "T00:00:00Z",
        statusWork: STATUS_WORK_CREATE,
        ownerId: req.user.userProfile.id,
        categoryId: +data.categoryId,
        workImage: data.workImage,
      },
    });
    res.status(201).json({ createWork });
  } catch (err) {
    next(err);
  }
};

exports.getAllWork = async (req, res, next) => {
  try {
    const allWork = await prisma.work.findMany({});
    console.log(value);
    res.status(201).json({ allWork });
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
    console.log(value);
    res.status(201).json({ allCategories });
  } catch (error) {
    next(error);
  }
};
