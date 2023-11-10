const express = require("express");
const router = express.Router();
const userController = require("../controllers/user-controller");
const uploadMiddleware = require("../middlewares/upload");
const authenticateMiddleware = require("../middlewares/authenticated");

router.patch(
  "/validateuser",
  authenticateMiddleware,
  uploadMiddleware.single("identifyImage"),
  userController.validateUser
);

router.get("/getuserprofile/:userId", userController.getUserProfileById);

router.patch(
  "/editprofile",
  authenticateMiddleware,
  uploadMiddleware.single("profileImage"),
  userController.updateProfile
);

router.post(
  "/createshowcase",
  authenticateMiddleware,
  uploadMiddleware.single("imagePictue"),
  userController.createShowCase
);

router.get("/showcase", authenticateMiddleware, userController.getAllShowCase);

router.post(
  "/createreport",
  authenticateMiddleware,
  userController.createReport
);

router.post(
  "/createreview",
  authenticateMiddleware,
  userController.createReview
);

router.get("/", authenticateMiddleware, userController.getalluser);

module.exports = router;
