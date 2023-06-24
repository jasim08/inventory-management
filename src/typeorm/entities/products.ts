import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  OneToMany,
  OneToOne,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ViewColumn,
  JoinTable,
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

  @Column()
  isDeleted: boolean;


  @OneToMany(()=> CrudHistory, crud => crud.product)
  curdhistory: CrudHistory[]

  @ManyToOne(()=> ProductCategory)
  @JoinColumn()
  category: ProductCategory



}
