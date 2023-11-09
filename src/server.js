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
  console.log(socket.handshake.auth);
  // const dealerId = socket.handshake.dealer.id;

  //   if (!userId) {
  //     return next(createError("user forbiden", 403));
  //   }

  onlineUser[userId] = socket.id;
  console.log(onlineUser, "onlineUser");
  next();
});

io.on("connection", (socket) => {
  console.log("connection");
  socket.on("sent_message", async ({ message, from, to, room }) => {
    const response = await prisma.chatMessages.create({
      data: {
        chatRoomId: room,
        senderId: from,
        receiverId: to,
        message: message,
      },
    });
    socket.emit("receive_message", response);
  });
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

//  { "1": "sdgdhtrhfcbcvb", "2": "dfhtfdhjfgchjn" } io.to(onlineUser[userId]).emit(dlfmgldf)

// f=> emit{msg:"aaaa",to:1}
// b=> on{msg:"aaaa",to:1}
// b=> emit{msg:"aaaa",userId:1}

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log("server run on port ", PORT));
