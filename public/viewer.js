window.onload = () => {
    document.getElementById('my-button').onclick = () => {
        init();
    }
}

async function init() {
    console.log("initted")
    const peer = createPeer();
    peer.addTransceiver("video", { direction: "recvonly" })
    peer.addTransceiver("audio", { direction: "recvonly" })
}

function createPeer() {
    const peer = new RTCPeerConnection({
        iceServers: [
            {
                urls: "stun:stun.stunprotocol.org"
            }
        ]
    });
    peer.ontrack = handleTrackEvent;
    peer.onnegotiationneeded = () => handleNegotiationNeededEvent(peer);

    return peer;
}

async function handleNegotiationNeededEvent(peer) {
    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);
    const payload = {
        sdp: peer.localDescription
    };
    console.log("postong to cnsumer")
    const { data } = await axios.post('/consumer', payload);
    const desc = new RTCSessionDescription(data.sdp);
    peer.setRemoteDescription(desc).catch(e => console.log(e));
}

function handleTrackEvent(e) {
    console.log(e.streams)
    document.getElementById("video").srcObject = e.streams[0];
};

