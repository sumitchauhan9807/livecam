"use strict";
const express = require("express");
const router = express.Router();

//user authentication and redirection
router.use(async (req, res, next) => {
  try {
    // check token from header
    let token = req.headers["authorization"]
      ? req.headers["authorization"].substring(7)
      : "";
    // decode token
    if (!token) {
      return next({ status: 401, message: "Authentication required" });
    } else if (token) {
      req.token = req.headers["authorization"].substring(7)
      return next();
    } 
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
