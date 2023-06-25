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
enum CRUDType {
  DELETE = 'DELETE',
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
}

@Entity({ name: 'crudhistory' })
export class CrudHistory extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: CRUDType;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User)
  @JoinColumn()
  user: User[];

  @ManyToOne(() => Products)
  @JoinColumn()
  product: Products[];
}
