import { Entity, PrimaryGeneratedColumn, PrimaryColumn, Column } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @PrimaryColumn()
    login: string

    @Column()
    firstName: string

    @Column()
    lastName: string

    @Column()
    address: string

    @Column()
    birthday: string

    @Column()
    isActive: boolean

    @Column()
    hashedPassword: string

}