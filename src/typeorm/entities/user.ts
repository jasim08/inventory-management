
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ViewColumn,
} from 'typeorm';
import { Profile } from './profile';
import { Posts } from './posts';

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

  @OneToMany(()=> Posts, (post)=> post.user)
  posts: Posts[]

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
