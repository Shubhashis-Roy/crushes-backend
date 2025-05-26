const express = require("express");
const { userAuth } = require("../middlewares/auth");
const {
  sendConnection,
  reviewConnection,
} = require("../controller/requestController");

const requestRouter = express.Router();

// Connection send to other
requestRouter.post("/request/send/:status/:toUserId", userAuth, sendConnection);

// Connection received
requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  reviewConnection
);

module.exports = requestRouter;
