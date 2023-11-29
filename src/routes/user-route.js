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
  uploadMiddleware.single("imagePicture"),
  userController.createShowCase
);

router.get(
  "/showcase/:id",
  authenticateMiddleware,
  userController.getAllShowCase
);

router.delete(
  "/showcase/:id",
  authenticateMiddleware,
  userController.deleteShowCasebyId
);
router.patch(
  "/editshowcase",
  authenticateMiddleware,
  uploadMiddleware.single("imagePicture"),
  userController.editShowCase
);

router.post(
  "/createreport",
  authenticateMiddleware,
  userController.createReport
);

router.get(
  "/userprofilereview/:id",
  authenticateMiddleware,
  userController.getReviewById
);

router.post(
  "/createreview",
  authenticateMiddleware,
  userController.createReview
);

router.get("/", authenticateMiddleware, userController.getalluser);

router.get("/verifyuser", authenticateMiddleware, userController.getverifyUser);

router.get("/banneduser", authenticateMiddleware, userController.getBannedUser);

router.patch("/verify/:id", authenticateMiddleware, userController.verifyuser);

router.patch("/banuser/:id", authenticateMiddleware, userController.banuser);
router.patch(
  "/unbanuser/:id",
  authenticateMiddleware,
  userController.unbanuser
);

module.exports = router;
