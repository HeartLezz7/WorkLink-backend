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
  "/changestatus/:id",
  authenticatedMiddleware,
  reportController.changeStatus
);

router.patch("/isclear/:id", authenticatedMiddleware, reportController.clear);

router.get("/isclear", authenticatedMiddleware, reportController.getisClear);

module.exports = router;
