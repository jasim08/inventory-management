import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Profile } from './profile';
import { CrudHistory } from './crudhistory';
import { Role } from './roles';

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  authType: string;

  @Column({ nullable: true })
  authValue: string;

  @Column({ nullable: true })
  roleId: number;

  @OneToOne(() => Profile, (profile) => profile.user)
  @JoinColumn()
  profile: Profile;

  @ManyToMany(() => CrudHistory, (crudhistory) => crudhistory.raisedBy)
  crudhistories: CrudHistory[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ default: false })
  isDeleted: boolean;
}
