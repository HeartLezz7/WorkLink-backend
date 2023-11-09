const express = require("express");
const router = express.Router();

const chatController = require("../controllers/chat-controller");
const authenticatedMiddleware = require("../middlewares/authenticated");

router.get("/get", authenticatedMiddleware, chatController.getAllChatRoom);
router.post("/createRoom", authenticatedMiddleware, chatController.createRoom);
router.get("/getMessage/:chatRoomId", chatController.getChatById);

module.exports = router;
