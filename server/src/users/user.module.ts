import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './interfaces/user.schema';
import { UserController } from './user.controller';
import { userService } from './user.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Users',
        schema: UserSchema,
      },
    ]),
  ],
  controllers: [UserController],
  providers: [userService],
  exports: [userService],
})
export class UserModule {}
