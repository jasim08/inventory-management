import { Role } from 'src/utils/roles';
import { Entity, Column, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column()
  age: number;

  @Column()
  dob: string;

  @Column({ type: 'json', nullable: true })
  additionalInfo: Record<string, any>;

  @Column()
  role: Role;

  @OneToOne(() => User, (user) => user.profile)
  user: User;
}
