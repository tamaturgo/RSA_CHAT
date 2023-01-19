import * as mongoose from 'mongoose';

export const MessageSchema = new mongoose.Schema(
  {
    message: String,
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
    collection: 'Messages',
  },
);