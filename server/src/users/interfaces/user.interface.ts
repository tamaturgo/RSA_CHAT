import { Document } from 'mongoose';

export interface User extends Document {
  phoneNumber: string;
  readonly email: string;
  name: string;
  ranking: string;
  rankingPosition: number;
  photoUrl: string;
  keyRSAPublic: string;
  password: string;
  friends: User[];
}
