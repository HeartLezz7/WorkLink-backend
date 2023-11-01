require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { createServer } = require("http");


const authRoute = require('./routes/auth-route');

const app = express();
const server = createServer(app);


app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use("/auth", authRoute);

app.get("/", (req, res) => {
  console.log("first");
  res.json({ message: "WorkLink deploy" });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log("server run on port ", PORT));
