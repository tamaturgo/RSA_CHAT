import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UpdateUserDTO } from './dtos/atualizar-user.dto';
import { CreateUserDTO } from './dtos/criar-user.dto';
import { User } from './interfaces/user.interface';
import { userService } from './user.service';
import { ValidatorParamsPipe } from '../common/pipes/validator-params.pipe';

@Controller('api/v1/user')
export class UserController {
  constructor(private readonly userService: userService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async CreatePlayer(@Body() createUserDTO: CreateUserDTO): Promise<User> {
    return await this.userService.CreatePlayer(createUserDTO);
  }

  @Put(':_id')
  @UsePipes(ValidationPipe)
  async updatePlayer(
    @Body() updateUserDTO: UpdateUserDTO,
    @Param('_id', ValidatorParamsPipe) _id: string,
  ): Promise<void> {
    await this.userService.UpdatePlayer(updateUserDTO, _id);
  }

  @Get()
  async getAllPlayers(): Promise<User[]> {
    return this.userService.getAllPlayers();
  }

  @Get('/:_id')
  async getPlayerById(
    @Param('_id', ValidatorParamsPipe) _id: string,
  ): Promise<User> {
    return this.userService.getPlayerById(_id);
  }
  @Delete('/:_id')
  async deletePlayer(
    @Param('_id', ValidatorParamsPipe) _id: string,
  ): Promise<void> {
    await this.userService.deletePlayer(_id);
  }

  @Post('/:_id/addFriend')
  async addFriend(
    @Param('_id', ValidatorParamsPipe) _id: string,
    @Body('friendId') friendId: string,
  ): Promise<void> {
    await this.userService.addFriend(_id, friendId);
  }

  @Post('/:_id/removeFriend')
  async removeFriend(
    @Param('_id', ValidatorParamsPipe) _id: string,
    @Body('friendId') friendId: string,
  ): Promise<void> {
    await this.userService.removeFriend(_id, friendId);
  }

  @Get('/publicKey/:userId')
  async getPublicKey(
    @Param('userId', ValidatorParamsPipe) userId: string,
  ): Promise<string> {
    return await this.userService.getPublicKey(userId);
  }
}
