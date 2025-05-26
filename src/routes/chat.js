const express = require("express");

const { userAuth } = require("../middlewares/auth");
const { chatting } = require("../controller/chatController");

const chatRouter = express.Router();

chatRouter.get("/chat/:targetUserId", userAuth, chatting);

module.exports = chatRouter;
