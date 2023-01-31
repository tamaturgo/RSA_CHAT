import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message } from './interfaces/message.interface';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel('Messages') private readonly messageModel: Model<Message>,
  ) {}

  async sendMessage(
    message: string,
    senderId: string,
    receiverId: string,
    keyRSAPublic: string,
  ): Promise<void> {
    const created = new this.messageModel({
      message,
      senderId,
      receiverId,
      keyRSAPublic,
    });
    await created.save();
  }

  async getAllMessages(): Promise<Message[]> {
    return await this.messageModel.find().exec();
  }

  async getMessagesBySenderId(
    senderId: string,
    chatId: string,
  ): Promise<Message[]> {
    return await this.messageModel.find({ senderId, chatId }).exec();
  }

  async getMessagesByChatId(chatId: string): Promise<Message[]> {
    return await this.messageModel.find({ chatId }).exec();
  
  }

  async getMessagesByReceiverId(
    receiverId: string,
    chatId: string,
  ): Promise<Message[]> {
    return await this.messageModel.find({ receiverId, chatId }).exec();
  }

  async getMessagesBySenderIdAndReceiverId(
    receiverId: string,
    senderId: string,
  ): Promise<Message[]> {
    return await this.messageModel.find({ receiverId, senderId }).exec();
  }

  async deleteMessageById(_id: string): Promise<void> {
    await this.messageModel.deleteOne({ _id }).exec();
  }

}
