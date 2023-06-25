import { Role } from 'src/utils/roles';

export class UpdateUserDto {
  username: string;
  password: string;
  role: Role;
  authType: string;
  authValue: string;
}
