import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { MessageSchema } from './interfaces/message.schema';

@Module({
  controllers: [MessageController],
  providers: [MessageService],
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Messages',
        schema: MessageSchema,
      },
    ]),
  ],
})
export class MessageModule {}
