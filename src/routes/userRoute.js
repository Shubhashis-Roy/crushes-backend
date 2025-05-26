const express = require("express");
const { userAuth } = require("../middlewares/auth");
const {
  getReceivedConnection,
  getAllConnection,
  getFeed,
} = require("../controller/userControllers");

const userRouter = express.Router();

// Get all the received connection request
userRouter.get("/user/requests/received", userAuth, getReceivedConnection);

// Get all the user connections
userRouter.get("/user/connections", userAuth, getAllConnection);

userRouter.get("/feed", userAuth, getFeed);

module.exports = userRouter;
