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
    const deleteReport = await prisma.report.findFirst({
      where: {
        id: +req.params.id,
      },
    });
    if (!deleteReport) {
      return res.status(404).json({ message: "Don't have driver" });
    }
    await prisma.report.delete({
      where: {
        id: +req.params.id,
      },
    });
    res.status(201).json({ deleteReport });
  } catch (err) {
    next(err);
  }
};
exports.submitReport = async (req, res, next) => {
  try {
    // const isAdmin = await prisma.authUser.findUnique({
    //   where: {
    //     id: req.user.id,
    //     userType: " admin",
    //   },
    // });
    // if (!isAdmin) {
    //   return createError("Access Denind", 403);
    // }
    // const foundReport = await prisma.report.findUnique({
    //   where: {
    //     workId: +req.body.workId,
    //   },
    // });
    // if (!foundReport) {
    //   return createError("Not found report", 401);
    // } else {
    //   const submitReport = await prisma.work.update({
    //     where: { id: foundReport.workId },
    //     data:{}
    //   });
    //   res.status(201).json({ submitReport });
    // }
    console.log(req.body);

    if (req.body.message === "approve") {
      console.log(req.body.message, "yes");
    } else {
      console.log(req.body.message, "no");
    }
    res.status(201).json({ msg: "success" });
  } catch (err) {
    next(err);
  }
};
