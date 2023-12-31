const prisma = require("../models/prisma");
const createError = require("../utils/create-error");

exports.getAllChatRoom = async (req, res, next) => {
  try {
    const allChatRoom = await prisma.chatMessages.findMany({
      where: {
        OR: [{ receiverId: req.user.id }, { senderId: req.user.id }],
      },
      include: {
        chatRoom: { include: { dealer: true, creater: true } },
      },
      orderBy: { createdAt: "desc" },
      distinct: ["chatRoomId"],
    });
    res.status(200).json({ allChatRoom });
  } catch (err) {
    next(err);
  }
};

exports.createRoom = async (req, res, next) => {
  try {
    const foundChatRoom = await prisma.chatRoom.findFirst({
      where: {
        dealerId: +req.body.dealerId,
        createrId: req.user.id,
        workId: +req.body.workId,
      },
    });
    if (foundChatRoom) {
      createError("already have room", 400);
      return res
        .status(403)
        .json({ message: "already havee chat room", foundChatRoom });
    }
    const chatRoom = await prisma.chatRoom.create({
      data: {
        workId: +req.body.workId,
        dealerId: +req.body.dealerId,
        createrId: req.user.id,
        chatMessage: {
          create: {
            message: "Nice to meet you",
            senderId: req.user.id,
            receiverId: +req.body.dealerId,
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
    res.status(200).json({ chatroom });
  } catch (err) {
    next(err);
  }
};
