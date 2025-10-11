import { Server as SocketIOServer, Socket } from 'socket.io';
import crypto from 'crypto';
import Chat from '../../models/chat.model';
import ConnectionRequestModel from '../../models/connectionRequest.model';
import { Server } from 'http';
import mongoose from 'mongoose';

// 🔹 Type definitions
interface MessagePayload {
  firstName: string;
  lastName: string;
  userId: string;
  targetUserId: string;
  text: string;
}

interface TypingPayload {
  userId: string;
  targetUserId: string;
}

interface JoinChatPayload {
  firstName: string;
  userId: string;
  targetUserId: string;
}

// 🧩 Helper to generate secret room ID
const getSecretRoomId = (userId: string, targetUserId: string): string => {
  return crypto.createHash('sha256').update([userId, targetUserId].sort().join('&')).digest('hex');
};

// 🧠 Main socket initialization
const initializeSocket = (server: Server): SocketIOServer => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: process.env.FE_URL,
      credentials: true,
    },
  });

  const onlineUsers = new Map<string, string>();

  io.on('connection', (socket: Socket) => {
    console.log(`✅ Socket connected: ${socket.id}`);

    // 🔹 Join Chat Room
    socket.on('joinChat', ({ firstName, userId, targetUserId }: JoinChatPayload) => {
      const roomId = getSecretRoomId(userId, targetUserId);
      socket.join(roomId);
      onlineUsers.set(userId, socket.id);
      socket.to(roomId).emit('userStatus', { userId, status: 'online' });
      console.log(`${firstName} joined room ${roomId}`);
    });

    // 🔹 Typing Event
    socket.on('typing', ({ userId, targetUserId }: TypingPayload) => {
      const roomId = getSecretRoomId(userId, targetUserId);
      socket.to(roomId).emit('typing', { userId });
    });

    // 🔹 Send Message
    socket.on('sendMessage', async (payload: MessagePayload) => {
      const { firstName, lastName, userId, targetUserId, text } = payload;
      const roomId = getSecretRoomId(userId, targetUserId);

      try {
        // 🧠 Verify friendship
        const existingConnectionReq = await ConnectionRequestModel.findOne({
          $or: [
            { fromUserId: userId, toUserId: targetUserId, status: 'accepted' },
            { fromUserId: targetUserId, toUserId: userId, status: 'accepted' },
          ],
        });

        if (!existingConnectionReq) {
          socket.emit('errorMessage', {
            message: 'They are not friends with each other.',
          });
          return;
        }

        // 💬 Save chat message
        let chat = await Chat.findOne({
          participants: { $all: [userId, targetUserId] },
        });

        if (!chat) {
          chat = new Chat({
            participants: [userId, targetUserId],
            messages: [],
          });
        }

        chat.messages.push({
          senderId: new mongoose.Types.ObjectId(userId),
          text,
          createdAt: new Date(),
        });

        await chat.save();
        io.to(roomId).emit('messageReceived', { firstName, lastName, text });
      } catch (err) {
        console.error('❌ Error while saving message:', err);
      }
    });

    // 🔹 Handle Disconnect
    socket.on('disconnect', () => {
      for (const [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          io.emit('userStatus', { userId, status: 'offline' });
          break;
        }
      }
      console.log(`⚠️ Socket disconnected: ${socket.id}`);
    });
  });

  return io;
};

export default initializeSocket;
