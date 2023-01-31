import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chat } from './interfaces/chat.interface';

@Injectable()
export class ChatService {
  constructor(@InjectModel('Chats') private readonly chatModel: Model<Chat>) {}

  async createChat(
    senderId: string,
    receiverId: string,
    keyRSAPublic: string,
  ): Promise<void> {
    const created = new this.chatModel({
      senderId,
      receiverId,
      keyRSAPublic,
    });
    await created.save();
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

  async deleteChatById(_id: string): Promise<void> {
    await this.chatModel.deleteOne({ _id }).exec();
  }

  async getKeysByChatId(chatId: string): Promise<Chat[]> {
    const result = await this.chatModel.find({ chatId }).exec();
    const keys = [];
    result.forEach((item) => {
      keys.push(item.keyRSAPublic);
    });
    return keys;
  }

}
