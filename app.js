const express = require("express");
const app = express();
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
require("dotenv").config();
var cors = require("cors");
var cookieParser = require("cookie-parser");

// import error
const errorHandler = require("./middleware/error");

// tambah config socket.io
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

// import routes
const authRoutes = require("./routes/authRoutes");
const postRoute = require("./routes/postRoute");
const feebackRoute = require("./routes/feebackRoute");
const kategoriRoutes = require("./routes/kategoriRoutes");

// database connection
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("DB connected"))
  .catch((err) => console.log(err));

// middleware
app.use(morgan("dev"));
app.use(bodyParser.json({ limit: "5mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "5mb",
    extended: true,
  })
);
app.use(cookieParser());
app.use(cors());

// ROUTES MIDDLEWARE
app.use("", authRoutes);
app.use("/api", postRoute);
app.use("/api", feebackRoute);
app.use("/api", kategoriRoutes);

// error middleware
app.use(errorHandler);

// port
const port = process.env.PORT || 9000;

// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });

io.on("connection", (socket) => {
  // console.log("a user connected", socket.id);
  socket.on("comment", (msg) => {
    // console.log("new-comment", msg);
    io.emit("new-comment", msg);
  });
});

exports.io = io;

// konek ke socket.io
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
