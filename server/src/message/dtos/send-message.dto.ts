import { IsNotEmpty } from 'class-validator';

export class SendMessageDTO {
  @IsNotEmpty()
  readonly message: string;

  @IsNotEmpty()
  readonly senderId: string;

  @IsNotEmpty()
  readonly reciverId: string;
}
