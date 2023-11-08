require("dotenv").config();

const server = require("./app");

const { Server } = require("socket.io");
const createError = require("./utils/create-error");

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

  //   if (!userId) {
  //     return next(createError("user forbiden", 403));
  //   }

  onlineUser[userId] = socket.id;
  console.log(onlineUser);
  next();
});

io.on("connection", (socket) => {
  console.log("connection");
  socket.on("message", (msg) => {
    console.log(msg);
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
