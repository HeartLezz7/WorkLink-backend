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
router.get("/mysignwork", authenticated, workController.getSignWork);
router.patch("/editwork", authenticated, workController.editWork);
router.patch("/cancle/:workId", authenticated, workController.cancleWork);
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
router.delete(
  "/signoutwork/:workId",
  authenticated,
  workController.deleteChallenger
);
router.patch("/review/:id", workController.updatereview);
router.patch("/reject/:id", workController.rejectwork);
router.patch("/updateStatus", workController.updateStatusWork);

module.exports = router;
