"use strict";
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken"); // used to create, sign, and verify tokens


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
      // verifies secret and checks exp
      jwt.verify(
        token,
        process.env.JWT_SECRET,
        {
          ignoreExpiration: true,
        },
        async (err, decoded) => {
          console.log(process.env.JWT_SECRET)
          console.log(token)
          if (err) {
            return next({ status: 401, message: "Authentication failed" });
          }
          req.userData = decoded
          return next();
        }
      );
    } else {
      return next();
    }
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
