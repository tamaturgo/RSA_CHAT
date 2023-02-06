import * as mongoose from 'mongoose';

export const ChatSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users',
    },
    reciverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users',
    },
  },
  {
    timestamps: true,
    collection: 'Chats',
  },
);
