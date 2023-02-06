import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  Get,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Chat } from './interfaces/chat.interface';
import { ChatService } from './chat.service';

@Controller('api/v1/chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async createChat(
    @Body('senderId') senderId: string,
    @Body('reciverId') reciverId: string,
  ): Promise<Chat> {
    const chat = await this.chatService.createChat(senderId, reciverId);
    return chat;
  }

  @Delete('/:_id')
  async deleteChatById(@Param('_id') _id: string): Promise<void> {
    await this.chatService.deleteChatById(_id);
  }

  @Get()
  async getAllChats(): Promise<Chat[]> {
    return await this.chatService.getAllChats();
  }

  @Get('/sender/:senderId')
  async getChatsBySenderId(
    @Param('senderId') senderId: string,
  ): Promise<Chat[]> {
    return await this.chatService.getChatsBySenderId(senderId);
  }

  @Get('/reciver/:receiverId')
  async getChatsByReceiverId(
    @Param('receiverId') receiverId: string,
  ): Promise<Chat[]> {
    return await this.chatService.getChatsByReceiverId(receiverId);
  }

  @Get('/reciver/:receiverId/sender/:senderId')
  async getChatsByReceiverIdAndSenderId(
    @Param('receiverId') receiverId: string,
    @Param('senderId') senderId: string,
  ): Promise<Chat[]> {
    return await this.chatService.getChatsByReceiverIdAndSenderId(
      receiverId,
      senderId,
    );
  }
}
