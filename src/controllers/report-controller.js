const prisma = require("../models/prisma");
const createError = require("../utils/create-error");

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
