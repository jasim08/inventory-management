
import { BaseEntity, Entity,Column,OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Profile } from "./profile";


@Entity()
export class Role extends BaseEntity{

@PrimaryGeneratedColumn()
id: number;

@Column()
role: String;

@Column()
roleDescription: String;
    
}