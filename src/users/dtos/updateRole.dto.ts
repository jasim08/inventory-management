import { IsEnum, IsNotEmpty } from 'class-validator';
import { Role } from 'src/utils/roles';

export class UpdateRoleDTO {
  @IsNotEmpty()
  @IsEnum(Role)
  role: number;
}
