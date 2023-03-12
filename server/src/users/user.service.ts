import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDTO } from './dtos/criar-user.dto';
import { User } from './interfaces/user.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateUserDTO } from './dtos/atualizar-user.dto';

@Injectable()
export class userService {
  constructor(@InjectModel('Users') private readonly userModel: Model<User>) {}

  async CreatePlayer(CreatePlayerDTO: CreateUserDTO): Promise<User> {
    const { email } = CreatePlayerDTO;
    const founded = await this.userModel.findOne({ email });
    if (founded) {
      throw new BadRequestException(
        `Jogador com e-mail: ${email} já está cadastrado.`,
      );
    }
    const created = new this.userModel(CreatePlayerDTO);
    return await created.save();
  }

  async UpdatePlayer(
    UpdatePlayerDTO: UpdateUserDTO,
    _id: string,
  ): Promise<User> {
    const founded = await this.userModel.findOne({ _id }).exec();

    if (!founded) {
      throw new NotFoundException(`jogador com o id (${_id}) não existe`);
    }
    return await this.userModel
      .findOneAndUpdate({ _id }, { $set: UpdatePlayerDTO })
      .exec();
  }

  async getAllPlayers(): Promise<User[]> {
    return await this.userModel.find().exec();
  }

  async getPlayerById(_id: string): Promise<User> {
    const founded = await this.userModel.findOne({ _id }).exec();
    if (!founded) {
      throw new NotFoundException(`jogador com o id (${_id}) não existe`);
    }
    return founded;
  }

  async deletePlayer(_id: string): Promise<any> {
    const founded = await this.userModel.findOne({ _id }).exec();
    if (!founded) {
      console.log('Player not found');
      throw new NotFoundException(`jogador com o id (${_id}) não existe`);
    }
    return await this.userModel.deleteOne({ _id }).exec();
  }

  async addFriend(_id: string, friendId: string): Promise<void> {
    const founded = await this.userModel.findOne({ _id }).exec();
    if (!founded) {
      throw new NotFoundException(`jogador com o id (${_id}) não existe`);
    }
    const friend = await this.userModel.findOne({ _id: friendId }).exec();
    if (!friend) {
      throw new NotFoundException(`jogador com o id (${friendId}) não existe`);
    }
    const foundedFriend = founded.friends.find(
      (friend) => friend._id === friendId,
    );
    if (foundedFriend) {
      throw new BadRequestException(
        `jogador com o id (${friendId}) já é seu amigo`,
      );
    }
    founded.friends.push(friend);
    await this.userModel.findOneAndUpdate(
      { _id },
      {
        $set: { friends: founded.friends },
      },
    );
  }

  async removeFriend(_id: string, friendId: string): Promise<void> {
    const founded = await this.userModel.findOne({ _id }).exec();
    if (!founded) {
      throw new NotFoundException(`jogador com o id (${_id}) não existe`);
    }
    const friend = await this.userModel.findOne({ _id: friendId }).exec();
    if (!friend) {
      throw new NotFoundException(`jogador com o id (${friendId}) não existe`);
    }
    const foundedFriend = founded.friends.find(
      (friend) => friend._id === friendId,
    );
    if (foundedFriend) {
      throw new BadRequestException(
        `jogador com o id (${friendId}) já é seu amigo`,
      );
    }
    // Remove o amigo do array de amigos do jogador
    founded.friends = founded.friends.filter(
      (friend) => friend._id !== friendId,
    );
    await this.userModel.findOneAndUpdate(
      { _id },
      {
        $set: { friends: founded.friends },
      },
    );
  }

  async getFriends(_id: string): Promise<User[]> {
    const founded = await this.userModel.findOne({ _id }).exec();
    if (!founded) {
      throw new NotFoundException(`jogador com o id (${_id}) não existe`);
    }
    return founded.friends;
  }

  async getPublicKey(_id: string): Promise<string> {
    const user = await this.userModel.find({ _id }).exec();
    if (!user) {
      throw new NotFoundException(`jogador com o id (${_id}) não existe`);
    }
    return user[0].rsaPublicKey;
  }

  async changeStatus(_id: string, status: string): Promise<void> {
    const user = await this.userModel.find({ _id }).exec();
    if (!user) {
      throw new NotFoundException(`jogador com o id (${_id}) não existe`);
    }
    await this.userModel.findOneAndUpdate({ _id }, { $set: { status } });
  }
}
