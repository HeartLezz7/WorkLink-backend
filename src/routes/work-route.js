const express = require("express");
const router = express.Router();
const workController = require("../controllers/work-controller");
const authenticated = require("../middlewares/authenticated");
const uploadMiddleware = require("../middlewares/upload");

router.post(
  "/creatework",
  authenticated,
  uploadMiddleware.single("workImage"),
  workController.createWork
);
router.get("/", workController.getAllWork);
router.get("/waitreview", workController.waitingreview);

router.get(
  "/getdelegatedworkbyid/:workId",
  workController.getDelegatedWorkById
);
router.delete("/delete/:id", workController.deleteWork);
router.post("/createcategories", workController.createworkCategories);
router.get("/allCategories", workController.getAllCategories);
router.post(
  "/challenger/:workId",
  authenticated,
  workController.createChallenger
);
router.patch("/review/:id", workController.updatereview);
router.patch("/reject/:id", workController.rejectwork);
router.patch("/updateStatus", workController.updateStatusWork);

module.exports = router;
