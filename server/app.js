const http = require("http");
const express = require("express");
const cors = require("cors");
const socketIO = require("socket.io");

const app = express();
const port = 3000 || process.env.PORT;

const users = [{}];

app.use(cors());
app.get("/", (req, res) => {
  res.send("Something is working");
});

const sever = http.createServer(app);
const io = socketIO(sever);

io.on("connection", (socket) => {
  console.log("new connection");

  //Joins connecion
  socket.on("joined", ({ user }) => {
    users[socket.id] = user;
    console.log(user);

    socket.broadcast.emit("userJoin", {
      user: "admin",
      message: `${users[socket.id]} has Joined`,
    });

    socket.emit("welcome", {
      user: "admin",
      message: `Welcom to the ${users[socket.id]} `,
    });
  });

  //communication connection
  socket.on("message", ({ message, id }) => {
    io.emit("sendMessage", { user: users[id], message, id });
  });

  //leave connecion
  socket.on("disconnect", () => {
    socket.broadcast.emit("leave", {
      user: "admin",
      message: `${users[socket.id]} has Leave`,
    });
    console.log("user left");
  });
});

sever.listen(port, () => {
  console.log(`server is running port http://localhost:${port}`);
});
