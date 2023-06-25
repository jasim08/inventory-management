import { IsNotEmpty, IsEmail } from 'class-validator';

export class CreatUserDto {
  @IsEmail()
  username: string;

  @IsNotEmpty()
  password: string;
}
