import { BaseEntity, Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
export class ProductCategory extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  category: string;
}
