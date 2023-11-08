const prisma = require("../models/prisma");

exports.getChatRoom = async (req, res, next) => {
  try {
    const chatroom = await prisma.chatRoom.findFirst({
      where: { createrId: req.user.id },
    });
    res.status(200).json({ chatroom });
  } catch (err) {
    next(err);
  }
};
