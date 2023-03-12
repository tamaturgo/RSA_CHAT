import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema(
  {
    phoneNumber: String,
    email: {
      type: String,
      unique: true,
    },
    name: String,
    ranking: String,
    rankingPosition: Number,
    photoUrl: String,
    password: String,
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
      },
    ],
    rsaPublicKey: String,
    status: {
      type: String,
      default: 'neverConnected',
    },
  },
  {
    timestamps: true,
    collection: 'Users',
  },
);
