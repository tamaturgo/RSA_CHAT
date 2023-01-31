import { Module } from '@nestjs/common';
import { UserModule } from './users/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MessageModule } from './message/message.module';
import { ChatModule } from './chat/chat.module';
@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://tamaturgo:diogeles19@cluster0.nsws3z1.mongodb.net/onranking?retryWrites=true&w=majority',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    ),
    UserModule,
    MessageModule,
    ChatModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
