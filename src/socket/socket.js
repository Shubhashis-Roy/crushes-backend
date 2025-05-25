const socket = require("socket.io");
const crypto = require("crypto");
const Chat = require("../models/chat");
const ConnectionRequestModel = require("../models/connectionRequest");

const getSecretRoomId = (userId, targetUserId) => {
  return crypto
    .createHash("sha256")
    .update([userId, targetUserId].sort().join("&"))
    .digest("hex");
};

const initialzeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: process.env.FE_URL,
    },
  });

  io.on("connection", (socket) => {
    // handle events

    socket.on("joinChat", ({ firstName, userId, targetUserId }) => {
      const roomId = getSecretRoomId(userId, targetUserId);

      socket.join(roomId);
    });

    socket.on(
      "sendMessage",
      async ({ firstName, lastName, userId, targetUserId, text }) => {
        const roomId = getSecretRoomId(userId, targetUserId);

        // check if yhe userId & targetUserId is frnd

        const existingConnectionReq = await ConnectionRequestModel.findOne({
          $or: [
            {
              fromUserId: userId,
              toUserId: targetUserId,
              status: "accepted",
            },
            {
              fromUserId: targetUserId,
              toUserId: userId,
              status: "accepted",
            },
          ],
        });

        if (!existingConnectionReq) {
          return res.json({
            message: "They are not frind not each other.",
          });
        }

        try {
          let chat = await Chat.findOne({
            participants: {
              $all: [userId, targetUserId],
            },
          });

          if (!chat) {
            chat = new Chat({
              participants: [userId, targetUserId],
              messages: [],
            });
          }

          chat.messages.push({
            senderId: userId,
            text,
          });

          await chat.save();
          io.to(roomId).emit("messageReceived", { firstName, lastName, text });
        } catch (err) {
          console.error("Error while save mgs in DB:", err);
        }
      }
    );

    socket.on("disconnect", () => {});
  });
};

module.exports = initialzeSocket;
