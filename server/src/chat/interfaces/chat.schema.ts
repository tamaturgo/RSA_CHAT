import * as mongoose from 'mongoose';

export const ChatSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users',
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users',
    },
    keyRSAPublic: String,
  },
  {
    timestamps: true,
    collection: 'Chats',
  },
);
