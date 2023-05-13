const express = require('express');
const router = express.Router();
const userAuth = require('./middlewares/userAuth')
const request  =  require('graphql-request').request
const gql  =  require('graphql-request').gql
const GraphQLClient = require('graphql-request').GraphQLClient
const endpoint = 'https://porntool.live/graphql'
const peerManager = require("./peer")

router.post('/identify',userAuth,async (req,res,next) => {

  let peerId = req.body.peerId;
  if(!peerId) {
    return res.status(422).send({
      message:"peer id undefined"
    })
  }
  try {
    const query = gql`
   query{
      UserInfo{
        id
        usrType
        username
      }
    }
  `
  const graphQLClient = new GraphQLClient(endpoint, {
    headers: {
      authorization: `Bearer ${req.token}`,
    },
  })
  
  const data = await graphQLClient.request(query)
  let userInfo = data.UserInfo
  peerManager.setPeerMeta({
    peerId:peerId,
    usrType: userInfo.usrType == null ? 'user' : userInfo.usrType,
    username : userInfo.username
  })
  res.send(data)
  }catch(e) {
    next(e)
  }
})


router.get('/allpeers',(req,res,next)=>{
  let allPeers = peerManager.getOnlinePeers()
  res.send({
    allPeers:allPeers
  })
})

module.exports = router;