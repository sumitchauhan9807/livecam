const PRODUCTION = false;
const videoGrid = document.getElementById("video-grid");
const socket = io("/");
const user = prompt("Enter your name");
var peer = new Peer({
  host: PRODUCTION ? 'cam.porntool.live' : 'localhost', 
  ...(!PRODUCTION) && {port: 5000},
  path: '/peerjs',
  config: {
    'iceServers': [
      {
        urls: "stun:a.relay.metered.ca:80",
      },
      {
        urls: "turn:a.relay.metered.ca:80",
        username: "b713400626ccb30ffe25c95a",
        credential: "Plt4+JLao80tCGm8",
      },
      {
        urls: "turn:a.relay.metered.ca:80?transport=tcp",
        username: "b713400626ccb30ffe25c95a",
        credential: "Plt4+JLao80tCGm8",
      },
      {
        urls: "turn:a.relay.metered.ca:443",
        username: "b713400626ccb30ffe25c95a",
        credential: "Plt4+JLao80tCGm8",
      },
      {
        urls: "turn:a.relay.metered.ca:443?transport=tcp",
        username: "b713400626ccb30ffe25c95a",
        credential: "Plt4+JLao80tCGm8",
      },
    ]
  },

  debug: 3
});
peer.on("open", (id) => {
  console.log('my id is' + id);
  socket.emit("join-room", 'model', id, user);
});
peer.on("call", (call) => {
  console.log('someone call me');
  call.answer(null);
  const video = document.createElement("video");
  call.on("stream", (userVideoStream) => {
    addVideoStream(video, userVideoStream);
  });
});

const addVideoStream = (video, stream) => {
  video.srcObject = stream;
  video.muted = true
  video.setAttribute("controls", "controls");

  video.addEventListener("loadedmetadata", () => {
    video.play();
    videoGrid.append(video);
  });
};

let text = document.querySelector("#chat_message");
let send = document.getElementById("send");
let messages = document.querySelector(".messages");

send.addEventListener("click", (e) => {
  if (text.value.length !== 0) {
    socket.emit("message", text.value);
    text.value = "";
  }
});

text.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && text.value.length !== 0) {
    socket.emit("message", text.value);
    text.value = "";
  }
});

socket.on("createMessage", (message, userName) => {
  messages.innerHTML =
    messages.innerHTML +
    `<div class="message">
        <b><i class="far fa-user-circle"></i> <span> ${userName === user ? "me" : userName
    }</span> </b>
        <span>${message}</span>
    </div>`;
});



// function connectnow(userId) {
//   const call = peer.call(userId);
//   console.log(call)
// }
// document.getElementById('connect').addEventListener('click',()=>{
//   let userId =  document.getElementById('user').value
//   connectnow(userId)
//   console.log(userId)
// })