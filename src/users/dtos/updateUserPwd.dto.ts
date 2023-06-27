import { IsNotEmpty } from 'class-validator';

export class updateUserPwdDTO {
  @IsNotEmpty()
  password: string;
}
