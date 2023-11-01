const express = require("express");
const route = express.Router();
const workController = require("../controllers/work-controller");

route.post("/creatework", workController.createWork);
route.get("/", workController.getAllWork);
route.delete("/delete/:id", workController.deleteWork);

module.exports = route;
