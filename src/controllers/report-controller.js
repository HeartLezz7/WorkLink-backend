const prisma = require("../models/prisma");

exports.createReport = async (req, res, next) => {
  try {
    console.log(req.body);
    const createReport = await prisma.report.create({
      data: {
        detail: req.body.reportMessage,
        workId: +req.body.workId,
        reportedId: +req.body.workerId,
        reportById: +req.user.id,
      },
    });

    const reportWork = await prisma.work.update({
      where: { id: +req.body.workId },
      data: { statusWork: "onIssue" },
    });
    res.status(201).json({ createReport, reportWork });
  } catch (err) {
    next(err);
  }
};

exports.getAllReport = async (req, res, next) => {
  try {
    const getReport = await prisma.report.findMany({
      include: {
        reportBy: true,
        reported: true,
        work: {
          select: {
            id: true,
            description: true,
            endDate: true,
            isOnsite: true,
            owner: true,
            price: true,
            startDate: true,
            statusWork: true,
            title: true,
            workImage: true,
            worker: true,
          },
        },
      },
    });
    res.status(201).json({ getReport });
  } catch (err) {
    next(err);
  }
};

exports.changeStatus = async (req, res, next) => {
  try {
    const value = req.body;
    const changeStatus = await prisma.work.update({
      where: {
        id: +req.params.id,
      },
      data: {
        statusWork: value.statusWork,
      },
    });
    res.status(201).json({ changeStatus });
  } catch (err) {
    next(err);
  }
};

exports.clear = async (req, res, next) => {
  try {
    const isClear = await prisma.report.findFirst({
      where: {
        id: +req.params.id,
      },
    });
    if (!isClear) {
      return res.status(404).json({ message: "Don't have driver" });
    }
    await prisma.report.update({
      where: {
        id: +req.params.id,
      },
      data: {
        isClear: true,
      },
    });
    res.status(201).json({ isClear });
  } catch (err) {
    next(err);
  }
};

exports.getisClear = async (req, res, next) => {
  try {
    const isClear = await prisma.report.findMany({
      where: {
        isClear: false,
      },
    });
    res.status(200).json({ isClear });
  } catch (error) {
    next(error);
  }
};
