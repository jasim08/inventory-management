import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from './user';
import { Products } from './products';

@Entity({ name: 'crudhistory' })
export class CrudHistory extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  crudtype: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User)
  @JoinColumn()
  raisedBy: User[];

  @Column()
  action: string;

  @ManyToOne(() => User)
  @JoinColumn()
  actionBy: User[];

  @Column({ default: false })
  status: boolean;

  @ManyToOne(() => Products)
  @JoinColumn()
  product: Products[];
}
