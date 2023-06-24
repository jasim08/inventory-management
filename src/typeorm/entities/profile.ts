
import { Role } from "src/utils/roles";
import { Entity,Column, PrimaryGeneratedColumn,ManyToOne, JoinColumn } from "typeorm";



@Entity({name: 'user_profiles'})
export class Profile {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstname:string;

    @Column()
    lastname:string;

    @Column()
    age: number;

    @Column()
    dob: string;

    @Column({ type: 'json', nullable: true })
    additionalInfo: Record<string, any>
  
    @Column()
    role: Role;

    

    
}