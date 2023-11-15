const prisma = require("../models/prisma");
const createError = require("../utils/create-error");

exports.getAllChatRoom = async (req, res, next) => {
  try {
    const allChatRoom = await prisma.chatRoom.findMany({
      where: {
        OR: [{ createrId: req.user.id }, { dealerId: req.user.id }],
      },
      include: { dealer: true, creater: true },
    });
    console.log(allChatRoom, "all");

    res.status(200).json({ allChatRoom });
  } catch (err) {
    next(err);
  }
};

exports.createRoom = async (req, res, next) => {
  try {
    console.log(req.body);
    console.log(req.user);
    const foundChatRoom = await prisma.chatRoom.findFirst({
      where: { dealerId: req.body.dealerId, createrId: req.user.id },
    });
    if (foundChatRoom) {
      createError("already have room", 400);
      return res.status(403).json({ message: "already havee chat room" });
    }
    const chatRoom = await prisma.chatRoom.create({
      data: {
        workId: req.body.workId,
        dealerId: req.body.dealerId,
        createrId: req.user.id,
        chatMessage: {
          create: {
            message: "Nice to meet you",
            senderId: req.user.id,
            receiverId: req.body.dealerId,
          },
        },
      },
      include: {
        chatMessage: true,
      },
    });
    res.status(201).json({ message: "hello", chatRoom });
  } catch (err) {
    next(err);
  }
};

exports.getChatById = async (req, res, next) => {
  try {
    const { chatRoomId } = req.params;
    const allMessage = await prisma.chatMessages.findMany({
      where: { chatRoomId: +chatRoomId },
      include: {
        sender: {
          select: { profileImage: true },
        },
      },
    });
    res.status(200).json({ allMessage });
  } catch (err) {
    next(err);
  }
};

exports.getChatByWorkId = async (req, res, next) => {
  try {
    const { workId } = req.params;
    const chatroom = await prisma.chatRoom.findFirst({
      where: {
        AND: [{ workId: +workId }, { dealerId: req.user.id }],
      },
    });
    console.log(chatroom);
    res.status(200).json({ chatroom });
  } catch (err) {
    next(err);
  }
};
