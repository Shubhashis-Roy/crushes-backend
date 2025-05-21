const socket = require("socket.io");
const crypto = require("crypto");

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
      ({ firstName, lastName, userId, targetUserId, text }) => {
        const roomId = getSecretRoomId(userId, targetUserId);

        io.to(roomId).emit("messageReceived", { firstName, lastName, text });
      }
    );

    socket.on("disconnect", () => {});
  });
};

module.exports = initialzeSocket;
