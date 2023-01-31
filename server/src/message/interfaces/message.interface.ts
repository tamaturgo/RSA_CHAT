import { Document } from 'mongoose';

export interface Message extends Document {
  message: string;
  senderId: string;
  receiverId: string;
  chatId: string;
}
