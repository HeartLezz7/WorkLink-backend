const express = require("express");
const router = express.Router();

const reportController = require("../controllers/report-controller");

const authenticatedMiddleware = require("../middlewares/authenticated");

router.post(
  "/createReport",
  authenticatedMiddleware,
  reportController.createReport
);

router.get("/", authenticatedMiddleware, reportController.getAllReport);

router.patch(
  "/submitReport",
  //   authenticatedMiddleware,
  reportController.submitReport
);

router.patch(
  "/changestatus/:id",
  authenticatedMiddleware,
  reportController.changeStatus
);

router.delete("/delete/:id", authenticatedMiddleware, reportController.clear);

module.exports = router;
