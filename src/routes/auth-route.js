const authController = require("../controllers/auth-controller");
const express = require("express");
const router = express.Router();
const authenticateMiddleware = require('../middlewares/authenticated')


router.post("/register", authController.register);
router.post("/login", authController.login);
router.get('/me',authenticateMiddleware,authController.getMe)

module.exports = router; 
