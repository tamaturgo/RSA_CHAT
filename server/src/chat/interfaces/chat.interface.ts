import { Document } from 'mongoose';

export interface Chat extends Document {
  senderId: string;
  reciverId: string;
}
