const express = require("express");
const router = express.Router();

const reportController = require("../controllers/report-controller");

const authenticatedMiddleware = require("../middlewares/authenticated");

router.post(
  "/createReport",
  authenticatedMiddleware,
  reportController.createReport
);

router.patch(
  "/submitReport",
  //   authenticatedMiddleware,
  reportController.submitReport
);

module.exports = router;
