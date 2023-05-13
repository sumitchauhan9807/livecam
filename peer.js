const onlinePeers = []
exports.peerFunctions = (peerServer) => {

  peerServer.on('connection', (client) => { 
    onlinePeers.push(client.id)
    console.log(onlinePeers," connected to peer")

    // console.log("someone connected to peer")
  });

  peerServer.on('disconnect', (client) => { 
    const index = onlinePeers.indexOf(client.id);
    if (index > -1) { 
      onlinePeers.splice(index, 1); 
    }
    console.log(onlinePeers," disconnect to peer")
    
  });
}

exports.getOnlinePeers = () => {
  return onlinePeers
}