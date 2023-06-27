import { Role } from 'src/utils/roles';

export class UpdateUserDto {
  password: string;
  role: Role;
  authType: string;
  authValue: string;
}
