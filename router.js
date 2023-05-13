const express = require('express');
const router = express.Router();
const userAuth = require('./middlewares/userAuth')
const jwt = require("jsonwebtoken");


router.get('/',userAuth,(req,res,next)=>{
  res.send(req.userData)
})


router.get('/token',(req,res,next)=>{
  let token = jwt.sign({ userId: 1324 }, process.env.JWT_KEY)
  res.send(token)
})

module.exports = router;