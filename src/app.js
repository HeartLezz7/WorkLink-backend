const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { createServer } = require("http");

const workRoute = require("./routes/work-route");
const authRoute = require("./routes/auth-route");
const adminRoute = require("./routes/admin-route");
const userRoute = require("./routes/user-route");
const transactionRoute = require("./routes/transaction-route");
const chatRoute = require("./routes/chat-route");
const reportRoute = require("./routes/report-route");

const app = express();
const server = createServer(app);

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use("/auth", authRoute);
app.use("/work", workRoute);
app.use("/admin", adminRoute);
app.use("/user", userRoute);
app.use("/transaction", transactionRoute);
app.use("/chat", chatRoute);
app.use("/report", reportRoute);

module.exports = server;
