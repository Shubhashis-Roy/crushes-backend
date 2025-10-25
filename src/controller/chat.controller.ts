import Chat from '../models/chat.model';
import { Request, Response } from 'express';
import { IUser } from '@/types/models/user';

// const chatting = async (req: Request, res: Response) => {
//   try {
//     const { targetUserId } = req.params;
//     if (!req.user) {
//       res.status(401).json({ message: 'User is not logged in' });
//       return;
//     }
//     const userId = req.user._id;
//     let chat = await Chat.findOne({
//       participants: {
//         $all: [userId, targetUserId],
//       },
//     })
//       .populate({
//         path: 'messages.senderId',
//         participants: {
//           $all: [userId, targetUserId],
//         },
//       })
//       .populate({
//         path: 'messages.senderId',
//         select: 'firstName lastName',
//       });

//     if (!chat) {
//       chat = new Chat({
//         participants: [userId, targetUserId],
//         messages: [],
//       });
//       await chat.save();
//     }

//     res.json(chat);
//   } catch (error) {
//     console.log('Error get the chat:', error);
//   }
// };

const chatting = async (req: Request, res: Response) => {
  try {
    const { targetUserId } = req.params;
    if (!req.user) {
      res.status(401).json({ message: 'User is not logged in' });
      return;
    }
    const userId = req.user._id;
    let chat = await Chat.findOne({
      participants: {
        $all: [userId, targetUserId],
      },
    })
      .populate({
        path: 'messages.senderId',
        select: 'firstName lastName',
      })
      .populate({
        path: 'participants',
        select: 'firstName lastName',
      });

    if (!chat) {
      chat = new Chat({
        participants: [userId, targetUserId],
        messages: [],
      });
      await chat.save();
    }

    res.json(chat);
  } catch (error) {
    console.log('Error get the chat:', error);
  }
};

// Get user list of chats
// const getChatUsersList = async (req, res) => {
//   const userId = req.user._id;

//   try {
//     // 1. Find all chats where current user is a participant
//     const chats = await Chat.find({ participants: userId }).populate(
//       "participants",
//       "firstName lastName photoUrl"
//     );

//     // 2. Extract the other participants
//     const otherUsers = [];
//     chats.forEach((chat) => {
//       chat.participants.forEach((participant) => {
//         if (participant._id.toString() !== userId.toString()) {
//           otherUsers.push(participant);
//         }
//       });
//     });

//     // 3. Remove duplicates (same user across multiple chats)
//     const uniqueUsers = Array.from(
//       new Map(otherUsers.map((u) => [u._id.toString(), u])).values()
//     );

//     // 4. Send response
//     res.json({
//       // message: "Chat users list fetched successfully",
//       users: uniqueUsers,
//     });
//   } catch (error) {
//     res.status(400).send(`getChatUsersList API Error: ${error.message}`);
//   }
// };

const getChatUsersList = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'User is not logged in' });
      return;
    }
    const userId = req.user._id;

    // 1. Find chats where the user is a participant, sorted by latest update
    const chats = await Chat.find({ participants: userId })
      .populate('participants', 'firstName lastName photoUrl')
      .sort({ updatedAt: -1 })
      .exec();

    // 2. Extract other participants with lastMessage + updatedAt
    const chatUsers = chats.map((chat) => {
      const otherUser = chat.participants.find(
        (p) => p._id.toString() !== userId.toString()
      ) as IUser;
      if (!otherUser) return null;

      // Get the last message (if exists)
      const lastMessage = chat.messages.length > 0 ? chat.messages[chat.messages.length - 1] : null;

      return {
        _id: otherUser._id,
        firstName: otherUser.firstName,
        lastName: otherUser.lastName,
        photoUrl: otherUser.photoUrl,
        lastMessage: lastMessage ? lastMessage.text : null,
        lastMessageAt: lastMessage ? lastMessage.createdAt : chat.updatedAt,
      };
    });

    // 3. Return list (already sorted by updatedAt)
    res.json({
      // message: "Chat users list fetched successfully",
      users: chatUsers,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    res.status(400).send(`getChatUsersList API Error: ${message}`);
  }
};

export { getChatUsersList, chatting };
