const express = require("express");

const { userAuth } = require("../middlewares/auth");
const { chatting, getChatUsersList } = require("../controller/chatController");

const chatRouter = express.Router();

chatRouter.get("/chat/users-list", userAuth, getChatUsersList);

chatRouter.get("/chat/:targetUserId", userAuth, chatting);

module.exports = chatRouter;
