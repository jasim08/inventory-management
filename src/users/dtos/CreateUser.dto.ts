import { IsNotEmpty } from "class-validator";

export class CreatUserDto{
@IsNotEmpty()
username: string;

@IsNotEmpty()
password: string;
}

