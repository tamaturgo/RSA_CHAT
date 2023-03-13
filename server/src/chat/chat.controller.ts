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

@Controller('')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get()
  getAllChats(): string {
    return 'Hello World';
  }
}
