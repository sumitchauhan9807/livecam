const PRODUCTION = true;
const videoGrid = document.getElementById("video-grid");
const socket = io("/");
const user = prompt("Enter your name");
var peer = new Peer({
  host: PRODUCTION ? 'cam.porntool.live' : 'localhost', 
  ...(!PRODUCTION) && {port: 5000},
  path: '/peerjs',
  config: {
    'iceServers': [
      // { url: 'stun:stun01.sipphone.com' },
      // { url: 'stun:stun.ekiga.net' },
      // { url: 'stun:stunserver.org' },
      // { url: 'stun:stun.softjoys.com' },
      // { url: 'stun:stun.voiparound.com' },
      // { url: 'stun:stun.voipbuster.com' },
      // { url: 'stun:stun.voipstunt.com' },
      // { url: 'stun:stun.voxgratia.org' },
      // { url: 'stun:stun.xten.com' },
      // {
      //   url: 'turn:192.158.29.39:3478?transport=udp',
      //   credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
      //   username: '28224511:1379330808'
      // },
      // {
      //   url: 'turn:192.158.29.39:3478?transport=tcp',
      //   credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
      //   username: '28224511:1379330808'
      // }
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