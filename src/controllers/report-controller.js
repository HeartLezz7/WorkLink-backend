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
