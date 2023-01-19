import { IsNotEmpty } from 'class-validator';

export class UpdateUserDTO {
  @IsNotEmpty()
  readonly phoneNumber: string;

  @IsNotEmpty()
  readonly name: string;

  @IsNotEmpty()
  readonly keyRSAPublic: string;
}
