const express = require("express");
const router = express.Router();

const chatController = require("../controllers/chat-controller");
const authenticatedMiddleware = require("../middlewares/authenticated");

router.get("/get_chat", authenticatedMiddleware, chatController.getChatRoom);

module.exports = router;
