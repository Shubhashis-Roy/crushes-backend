const express = require("express");
const {
  register,
  login,
  logout,
  deleteUser,
} = require("../controller/authControllers");
const { userAuth } = require("../middlewares/auth");

const authRouter = express.Router();

// register API
authRouter.post("/signup", register);

// Login
authRouter.post("/login", login);

// Logout
authRouter.post("/logout", logout);

//Delete
authRouter.delete("/delete", userAuth, deleteUser);

module.exports = authRouter;
