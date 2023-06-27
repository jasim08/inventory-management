import { IsNotEmpty } from 'class-validator';

export class signInDTO {
  @IsNotEmpty()
  username: string;
  @IsNotEmpty()
  password: string;
}
