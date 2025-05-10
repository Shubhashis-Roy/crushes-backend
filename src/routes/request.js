const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const requestRouter = express.Router();

// Connection send to other
requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      if (!["ignored", "interested"].includes(status)) {
        return res
          .status(400)
          .json({ message: "Invalid status type: " + status });
      }

      // Check if the toUser exists
      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(400).json({ message: "User not found" });
      }

      // Check for an existing connection request in either direction
      const existingConnectionReq = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      // If a request exists
      if (existingConnectionReq) {
        if (existingConnectionReq.status === "rejected") {
          existingConnectionReq.status = status;
          const updatedReq = await existingConnectionReq.save();

          return res.json({
            message: `${req.user.firstName} is ${status} in ${toUser.firstName}`,
            data: updatedReq,
          });
        } else {
          return res
            .status(400)
            .json({ message: "Connection request already exists!!!" });
        }
      }

      // No existing request, create new
      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();

      res.json({
        message: `${req.user.firstName} is ${status} in ${toUser.firstName}`,
        data,
      });
    } catch (error) {
      res.status(400).send(`connectionReq API Error: ${error.message}`);
    }
  }
);

// Connection received
requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const { status, requestId } = req.params;
      const loggedInUser = req.user;

      if (!["accepted", "rejected"].includes(status)) {
        return res.status(400).json({ message: "status is not allowed" });
      }

      const connectionReq = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });
      if (!connectionReq) {
        return res.status(400).json({ message: "Connection req is not found" });
      }

      connectionReq.status = status;
      const data = await connectionReq.save();

      res.json({ message: "Connection request " + status, data });
    } catch (error) {
      res.status(400).send(`connectionReceived api Error: ${error.message}`);
    }
  }
);

module.exports = requestRouter;
