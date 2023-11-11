const express = require("express");
const route = express.Router();
const workController = require("../controllers/work-controller");
const authenticated = require("../middlewares/authenticated");
const uploadMiddleware = require("../middlewares/upload");

route.post(
  "/creatework",
  authenticated,
  uploadMiddleware.single("workImage"),
  workController.createWork
);
route.patch("/editwork", authenticated, workController.editWork);
route.get("/", workController.getAllWork);
route.get("/getdelegatedworkbyid/:workId", workController.getDelegatedWorkById);
route.delete("/delete/:id", workController.deleteWork);
route.post("/createcategories", workController.createworkCategories);
route.get("/allCategories", workController.getAllCategories);
route.post(
  "/challenger/:workId",
  authenticated,
  workController.createChallenger
);

module.exports = route;
