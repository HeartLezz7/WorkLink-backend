const express = require("express");
const router = express.Router();
const userController = require("../controllers/user-controller");
const uploadMiddleware = require("../middlewares/upload");
const authenticateMiddleware = require("../middlewares/authenticated");

router.patch(
  "/validateProfile",
  authenticateMiddleware,
  uploadMiddleware.single("identifyImage"),
  // uploadMiddleware.
  // fields([
  //   { name: "profileImage", maxCount: 1 },
  //   { name: "identifyImage", maxCount: 1 },
  // ]),
  userController.validateProfile
);

// router.patch(
//   "/uploadprofileimage/:id",
//   authenticateMiddleware,
//   uploadMiddleware.single("profileImage"),
//   userController.updateProfile
// );

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

module.exports = router;
