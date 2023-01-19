import { IsNotEmpty } from 'class-validator';

export class SendMessageDTO {
  @IsNotEmpty()
  readonly message: string;

  @IsNotEmpty()
  readonly senderId: string;

  @IsNotEmpty()
  readonly receiverId: string;

  @IsNotEmpty()
  readonly keyRSAPublic: string;
}
