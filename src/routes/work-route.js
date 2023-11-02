const express = require("express");
const route = express.Router();
const workController = require("../controllers/work-controller");
const authenticated = require('../middlewares/authenticated')

route.post("/creatework",authenticated, workController.createWork);
route.get("/", workController.getAllWork);
route.delete("/delete/:id", workController.deleteWork);
route.post('/createcategories', workController.createworkCategories);
route.get('/allCategories', workController.getAllCategories);


module.exports = route;
