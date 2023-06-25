import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CrudHistory } from './crudhistory';
import { ProductCategory } from './productcategory';

@Entity()
export class Products extends BaseEntity {
  // id
  // productname
  // productdescription
  // isdeleted: boolean
  // categoryId

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  productname: string;

  @Column()
  productdescription: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ default: false })
  isDeleted: boolean;

  @OneToMany(() => CrudHistory, (crud) => crud.product)
  curdhistory: CrudHistory[];

  @ManyToOne(() => ProductCategory)
  @JoinColumn()
  category: ProductCategory;
}
