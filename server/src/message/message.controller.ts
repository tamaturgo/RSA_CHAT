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
import { Message } from './interfaces/message.interface';
import { MessageService } from './message.service';

@Controller('api/v1/message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async sendMessage(
    @Body('message') message: string,
    @Body('senderId') senderId: string,
    @Body('reciverId') reciverId: string,
  ): Promise<String> {
    return await this.messageService.sendMessage(message, senderId, reciverId);
  }

  @Delete('/:_id')
  async deleteMessageById(@Param('_id') _id: string): Promise<void> {
    await this.messageService.deleteMessageById(_id);
  }

  @Get()
  async getAllMessages(): Promise<Message[]> {
    return await this.messageService.getAllMessages();
  }

  @Get('/chat/:chatId')
  async getMessagesByChatId(
    @Param('chatId') chatId: string,
  ): Promise<Message[]> {
    return await this.messageService.getMessagesByChatId(chatId);
  }

  @Get('/sender/:senderId/chat/:chatId')
  async getMessagesBySenderId(
    @Param('senderId') senderId: string,
    @Param('chatId') chatId: string,
  ): Promise<Message[]> {
    return await this.messageService.getMessagesBySenderId(senderId, chatId);
  }

  @Get('/receiver/:receiverId/chat/:chatId')
  async getMessagesByReceiverId(
    @Param('receiverId') receiverId: string,
    @Param('chatId') chatId: string,
  ): Promise<Message[]> {
    return await this.messageService.getMessagesByReceiverId(
      receiverId,
      chatId,
    );
  }

  @Get('/sender/:senderId/receiver/:receiverId')
  async getMessagesBySenderIdAndReceiverId(
    @Param('senderId') senderId: string,
    @Param('receiverId') receiverId: string,
  ): Promise<Message[]> {
    return await this.messageService.getMessagesBySenderIdAndReceiverId(
      senderId,
      receiverId,
    );
  }
}
