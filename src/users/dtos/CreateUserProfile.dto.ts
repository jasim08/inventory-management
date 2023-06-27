import { IsNotEmpty } from 'class-validator';

export class CreateUserProfileDto {
  @IsNotEmpty()
  firstname: string;
  @IsNotEmpty()
  lastname: string;
  @IsNotEmpty()
  age: number;
  @IsNotEmpty()
  dob: string;
  additionalInfo: JSON;
}
