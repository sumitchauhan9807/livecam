const express = require("express");
const app = express();
require("dotenv").config();
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
const server = require("http").Server(app);
const { v4: uuidv4 } = require("uuid");
const peerFunctions = require('./peer').peerFunctions;
const routes = require('./router')
app.set("view engine", "ejs");
const io = require("socket.io")(server, {
  cors: {
    origin: '*'
  }
});
const { ExpressPeerServer } = require("peer");
const opinions = {
  debug: true,
}
let peerServer = ExpressPeerServer(server, opinions);
peerFunctions(peerServer)
app.use("/peerjs", peerServer);
app.use(express.static("public"));
app.use('/api', routes)

app.get("/", (req, res) => {
  res.redirect(`/${uuidv4()}`);
});
app.get("/consumer", (req, res) => {
  res.sendFile((__dirname + '/views/consumer2.html'))
});
app.get("/consumer2", (req, res) => {
  res.sendFile((__dirname + '/views/consumer2.html'))
});
app.get("/:room", (req, res) => {
  res.sendFile((__dirname + '/views/room.html'))

});

io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId, userName) => {
    // console.log(roomId,userId,userName,"join-room")

    socket.join(roomId);
    setTimeout(()=>{
      socket.to(roomId).broadcast.emit("user-connected", userId);
    }, 1000)
    socket.on("message", (message) => {
      io.to(roomId).emit("createMessage", message, userName);
    });
  });
});

//  peerServer.on('disconnect', (client) => { 
//   console.log(client)

//   console.log("someone dic")
//  });
app.use(function (err, req, res, next) {
  console.log(err)
  res.status(err.status || 500);
  res.json({
    code: err.code || 500,
    status: err.status || 500,
    message: err.message || "Something went wrong.",
  });
});
server.listen(process.env.PORT || 5000);
