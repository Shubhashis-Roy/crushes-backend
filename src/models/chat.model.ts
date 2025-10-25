import mongoose, { Document, Types, Model } from 'mongoose';
import { IUser } from '@/types/models/user';

export interface IMessage {
  senderId: Types.ObjectId;
  text: string;
  createdAt: Date;
}

export interface IChat extends Document {
  participants: (Types.ObjectId | IUser)[];
  messages: IMessage[];
  updatedAt: Date;
}

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      require: true,
    },

    text: {
      type: String,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

const chatSchema = new mongoose.Schema(
  {
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true }],
    messages: [messageSchema],
  },
  { timestamps: true }
);

const Chat: Model<IChat> = mongoose.model<IChat>('Chat', chatSchema);
export default Chat;
