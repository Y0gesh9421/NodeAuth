import { Entity, Column, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: string

    @Column()
    name: string

    @Column({ unique: true })
    email: string

    @Column()
    password: string

    @Column()
    mobileNo: string

    @Column({ default: false })
    verifiedEmail: boolean

    @Column({ default: 0 })
    otp: string

    @Column()
    role: string

    @Column('simple-array')
    permissions: string[];
}
