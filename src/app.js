require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { createServer } = require("http");
const workRoute = require("./routes/work-route");
const authRoute = require("./routes/auth-route");
const adminRoute = require('./routes/admin-route')
const userRoute = require('./routes/user-route')
const categoryRoute = require('./routes/category-route')

const app = express();
const server = createServer(app);

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use('/auth', authRoute)
app.use('/work', workRoute)
app.use('/admin', adminRoute)
app.use('/user',userRoute)
// app.use('/category', categoryRoute)


const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log("server run on port ", PORT));
