const express = require("express");
const { register, login, logout } = require("../controller/authControllers");

const authRouter = express.Router();

// register API
authRouter.post("/signup", register);

// Login
authRouter.post("/login", login);

// Logout
authRouter.post("/logout", logout);

module.exports = authRouter;
