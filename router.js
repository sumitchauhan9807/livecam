const express = require('express');
const router = express.Router();
const userAuth = require('./middlewares/userAuth')
const jwt = require("jsonwebtoken");
const request  =  require('graphql-request').request
const gql  =  require('graphql-request').gql
const GraphQLClient = require('graphql-request').GraphQLClient

router.get('/',userAuth,async (req,res,next) => {

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
  const endpoint = 'https://porntool.live/graphql'
  const graphQLClient = new GraphQLClient(endpoint, {
    headers: {
      authorization: `Bearer ${req.token}`,
    },
  })
  const data = await graphQLClient.request(query)
  
    res.send(data)
  }catch(e) {
    next(e)
  }
})


router.get('/token',(req,res,next)=>{
  let token = jwt.sign({ userId: 1324 }, process.env.JWT_KEY)
  res.send(token)
})

module.exports = router;