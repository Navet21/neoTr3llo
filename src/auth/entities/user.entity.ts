import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity('users')
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text',{
        unique: true
    })
    email: string;

    @Column('text',{
        select:false
    })
    password: string;

    @Column('text')
    fullName: string;

    @Column('bool',{
        default:true
    })

    //No se van a eliminar usuarios en la base de datos, se van a desactivar.
    isActive: boolean;

    @Column('text',{
        array: true,
        default:['user']
    })
    roles: string[];

    @BeforeInsert()
    checkFieldsBeforeInsert(){
        this.email = this.email.toLocaleLowerCase().trim();
    }

    @BeforeUpdate()
    checkFieldsBeforeUpdate(){
        this.email = this.email.toLocaleLowerCase().trim();
    }
}
