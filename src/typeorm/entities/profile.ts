import { Role } from 'src/utils/roles';
import { Entity, Column, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  firstname: string;

  @Column({ nullable: true })
  lastname: string;

  @Column({ nullable: true })
  age: number;

  @Column({ nullable: true })
  dob: string;

  @Column({ type: 'json', nullable: true })
  additionalInfo: Record<string, any>;

  @OneToOne(() => User, (user) => user.profile)
  user: User;
}
