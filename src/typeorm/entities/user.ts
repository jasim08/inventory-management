
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Profile } from './profile';
import { CrudHistory } from './crudhistory';

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;


  @Column({nullable:true})
  authType: string;

  @Column({ nullable: true })
  authValue: string;

  @OneToOne(()=> Profile)
  @JoinColumn()
  profile: Profile


  @ManyToMany(()=> CrudHistory, (crudhistory)=> crudhistory.user)
  crudhistories: CrudHistory[]

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({default: false})
  isDeleted : boolean

}
