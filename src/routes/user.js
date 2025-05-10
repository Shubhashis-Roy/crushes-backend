const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const userRouter = express.Router();

const USER_SAFE_DATA = "firstName lastName photoUrl skills about age";

// Get all the received connection request
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionReq = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);

    res.json({
      message: "Data fetched succesfuly",
      data: connectionReq,
    });
  } catch (error) {
    req.statusCode(400).send("Error in get user request: ", error.message);
  }
});

// Test this API
// Get all the user connections
userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRes = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    const data = connectionRes.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    res.json({ data });
  } catch (error) {
    req.statusCode(400).send("Error in get user connections: ", error.message);
  }
});

// User should not see
//0. his own card
//1. his connections
//2. ignored people
//3. already sent the connection req
userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;

    limit = limit > 50 ? 50 : limit;

    const skip = (page - 1) * limit;

    // Find all connection req(send + received)
    const connectionReq = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");
    // .populate("fromUserId", "firstName")
    // .populate("toUserId", "firstName");

    const hideUsersFromFeed = new Set();

    connectionReq.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });

    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);

    res.json({
      message: "Feed users",
      data: users,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

module.exports = userRouter;
