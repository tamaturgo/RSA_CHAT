import * as mongoose from 'mongoose';

export const MessageSchema = new mongoose.Schema(
  {
    message: String,
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users',
    },
    reciverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users',
    },
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chats',
    },
  },
  {
    timestamps: true,
    collection: 'Messages',
  },
);
