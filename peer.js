const onlinePeers = []
exports.peerFunctions = (peerServer) => {

  peerServer.on('connection', (client) => { 
    onlinePeers.push({
      peerId: client.id,
      usrType: null,
      username: null
    })
    console.log(onlinePeers," connected to peer")

    // console.log("someone connected to peer")
  });

  peerServer.on('disconnect', (client) => { 
    const index = onlinePeers.findIndex(peer => peer.peerId == client.id)
    if (index > -1) { 
      onlinePeers.splice(index, 1); 
    }
    console.log(onlinePeers," disconnect to peer")
    
  });
}

exports.getOnlinePeers = () => {
  return onlinePeers
}

exports.setPeerMeta = ({peerId,usrType,username}) => {
  const index = onlinePeers.findIndex(peer => peer.peerId == peerId)
  console.log(index,"indexx")
  if (index > -1) { 
    onlinePeers[index].usrType = usrType
    onlinePeers[index].username = username
  }
}