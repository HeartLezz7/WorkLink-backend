require("dotenv").config();
const fs = require("fs/promises");

const server = require("./app");

const { Server } = require("socket.io");
const prisma = require("./models/prisma");
const { upload } = require("./utils/cloundinary-service");

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
    credentials: true,
    methods: ["GET", "POST"],
  },
});

const onlineUser = {};

io.use((socket, next) => {
  const userId = socket.handshake.auth.id;
  onlineUser[userId] = socket.id;
  console.log(onlineUser, "onlineUser");
  next();
});

io.on("connection", (socket) => {
  console.log("connection");
  socket.on(
    "sent_message",
    async ({ message, senderId, receiverId, room, type }) => {
      if (type == "file") {
        const fileName = "" + Date.now() + Math.round(Math.random() * 1000000);
        const path = `public/${fileName}.jpg`;
        console.log(path, "AAA");
        await fs.writeFile(path, message);
        const url = await upload(path);
        console.log(url, "cloudinary");
        fs.unlink(path);
        const response = await prisma.chatMessages.create({
          data: {
            chatRoomId: room,
            senderId,
            receiverId,
            message: url,
          },
        });
        console.log(response);

        socket
          .to(onlineUser[String(receiverId)])
          .emit("receive_message", response);
      } else {
        const response = await prisma.chatMessages.create({
          data: {
            chatRoomId: room,
            senderId,
            receiverId,
            message,
          },
          include: {
            sender: {
              select: { profileImage: true },
            },
          },
        });

        socket
          .to(onlineUser[String(receiverId)])
          .emit("receive_message", response);
      }
    }
  );
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log("server run on port ", PORT));
