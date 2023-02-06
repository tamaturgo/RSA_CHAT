import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chat } from './interfaces/chat.interface';

@Injectable()
export class ChatService {
  constructor(@InjectModel('Chats') private readonly chatModel: Model<Chat>) {}

  async createChat(senderId: string, reciverId: string): Promise<Chat> {
    const created = new this.chatModel({
      senderId,
      reciverId,
    });
    await created.save();

    return created;
  }

  async getAllChats(): Promise<Chat[]> {
    return await this.chatModel.find().exec();
  }

  async getChatsBySenderId(senderId: string): Promise<Chat[]> {
    return await this.chatModel.find({ senderId }).exec();
  }

  async getChatsByReceiverId(receiverId: string): Promise<Chat[]> {
    return await this.chatModel.find({ receiverId }).exec();
  }

  async getChatsByReceiverIdAndSenderId(
    receiverId: string,
    senderId: string,
  ): Promise<Chat[]> {
    const chat1 = await this.chatModel.find({ receiverId, senderId }).exec();
    const chat2 = await this.chatModel
      .find({ receiverId: senderId, senderId: receiverId })
      .exec();

    if (chat1.length > 0) {
      return chat1;
    }
    if (chat2.length > 0) {
      return chat2;
    }
    return [];
  }

  async deleteChatById(_id: string): Promise<void> {
    await this.chatModel.deleteOne({ _id }).exec();
  }
}
