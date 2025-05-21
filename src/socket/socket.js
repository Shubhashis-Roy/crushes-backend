const socket = require("socket.io");

const initialzeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: process.env.FE_URL,
    },
  });

  io.on("connection", (socket) => {
    // handle events

    socket.on("joinChat", () => {});

    socket.on("sendMessage", () => {});

    socket.on("disconnect", () => {});
  });
};

module.exports = initialzeSocket;
