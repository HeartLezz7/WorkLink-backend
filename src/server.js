require("dotenv").config();

const server = require("./app");

const { Server } = require("socket.io");
const createError = require("./utils/create-error");
const { conversation } = require("./controllers/chat-controller");
const prisma = require("./models/prisma");

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
  socket.on("sent_message", async ({ message, senderId, receiverId, room }) => {
    const response = await prisma.chatMessages.create({
      data: {
        chatRoomId: room,
        senderId,
        receiverId,
        message: message,
      },
    });
    console.log(response);
    socket.to(onlineUser[String(receiverId)]).emit("receive_message", response);
  });
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log("server run on port ", PORT));
