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
    @Body('receiverId') receiverId: string,
    @Body('keyRSAPublic') keyRSAPublic: string,
  ): Promise<void> {
    await this.messageService.sendMessage(
      message,
      senderId,
      receiverId,
      keyRSAPublic,
    );
  }

  @Delete('/:_id')
  async deleteMessageById(@Param('_id') _id: string): Promise<void> {
    await this.messageService.deleteMessageById(_id);
  }

  @Get()
  async getAllMessages(): Promise<Message[]> {
    return await this.messageService.getAllMessages();
  }

  @Get('/sender/:senderId')
  async getMessagesBySenderId(
    @Param('senderId') senderId: string,
  ): Promise<Message[]> {
    return await this.messageService.getMessagesBySenderId(senderId);
  }

  @Get('/receiver/:receiverId')
  async getMessagesByReceiverId(
    @Param('receiverId') receiverId: string,
  ): Promise<Message[]> {
    return await this.messageService.getMessagesByReceiverId(receiverId);
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
