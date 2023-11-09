const prisma = require("../models/prisma");

exports.createReport = async (req, res, next) => {
  try {
    console.log(req.body);
    const createReport = await prisma.report.create({
      data: {
        detail: req.body.reportMessage,
        workId: +req.body.workId,
        reportById: +req.body,
        reportBy: +req.body,
      },
    });
  } catch (err) {
    next(err);
  }
};
