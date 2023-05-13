const express = require('express');
const router = express.Router();
const userAuth = require('./middlewares/userAuth')
router.get('/',userAuth,(req,res,next)=>{
  res.send("herrrlo")
})

module.exports = router;