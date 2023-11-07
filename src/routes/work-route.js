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
route.get("/", workController.getAllWork);
route.delete("/delete/:id", workController.deleteWork);
route.post("/createcategories", workController.createworkCategories);
route.get("/allCategories", workController.getAllCategories);
route.post(
  "/challenger/:workid",
  authenticated,
  workController.createChallenger
);

module.exports = route;
