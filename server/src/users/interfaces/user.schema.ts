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
    keyRSAPublic: String,
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
      },
    ],
  },
  {
    timestamps: true,
    collection: 'Users',
  },
);
