const express = require("express");
const {
  signupController,
  loginController,
  logoutController,
} = require("../controller/authControllers");

const authRouter = express.Router();

// signup API
authRouter.post("/signup", signupController);

// Login
authRouter.post("/login", loginController);

// Logout
authRouter.post("/logout", logoutController);

module.exports = authRouter;
