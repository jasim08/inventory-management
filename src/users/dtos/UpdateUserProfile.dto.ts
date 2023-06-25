import { Role } from 'src/utils/roles';

export class UpdateUserProfileDto {
  firstname: string;
  lastname: string;
  age: number;
  dob: string;
  additionalInfo: Record<string, any> | null;
  role: Role;
}
