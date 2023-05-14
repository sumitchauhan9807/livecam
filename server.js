const express = require("express");
const app = express();
const cors = require('cors');
app.use(cors({
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
}));
require("dotenv").config();
const bodyParser = require("body-parser");
app.use((req, res, next) => {
    bodyParser.json()(req, res, next);
});
app.use(bodyParser.urlencoded({ extended: true }));
const server = require("http").Server(app);
const { v4: uuidv4 } = require("uuid");
const peerFunctions = require('./peer').peerFunctions;
const routes = require('./router')
app.set("view engine", "ejs");
// const io = require("socket.io")(server, {
//   cors: {
//     origin: '*'
//   }
// });
const { ExpressPeerServer } = require("peer");
const opinions = {
  debug: true,
}
let peerServer = ExpressPeerServer(server, opinions);
peerFunctions(peerServer)
app.use("/peerjs", peerServer);
app.use(express.static("public"));
app.use('/img', express.static('vue/img'));
app.use('/css', express.static('vue/css'));
app.use('/js', express.static('vue/js'));
app.use('/api', routes)

// app.get("/webcam", (req, res) => {
//   res.redirect(`/${uuidv4()}`);
// });


app.get([
  "/",
  "/modelcam/:username",
  "/livecam/:username"
], (req, res) => {
  res.sendFile((__dirname + '/vue/index.html'))
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

// io.on("connection", (socket) => {
//   socket.on("join-room", (roomId, userId, userName) => {
//     // console.log(roomId,userId,userName,"join-room")

//     socket.join(roomId);
//     setTimeout(()=>{
//       socket.to(roomId).broadcast.emit("user-connected", userId);
//     }, 1000)
//     socket.on("message", (message) => {
//       io.to(roomId).emit("createMessage", message, userName);
//     });
//   });
// });

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
