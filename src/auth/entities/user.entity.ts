import { BoardUser } from "src/board-users/entities/board-user.entity";
import { Comment } from "src/comments/entities/comment.entity";
import { Task } from "src/tasks/entities/task.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";


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

    //Relationships

    @OneToMany(
        () => BoardUser, 
        (boardUser) => boardUser.user
    )
    boardUsers?: BoardUser[];

    @ManyToMany(
        () => Task,
        Task => Task.users
    )
    @JoinTable()
    tasks?: Task[]

    @OneToMany(
        () => Comment, 
        (comment) => comment.user
    )
    comments?: Comment[];

    //
    @BeforeInsert()
    checkFieldsBeforeInsert(){
        this.email = this.email.toLocaleLowerCase().trim();
    }

    @BeforeUpdate()
    checkFieldsBeforeUpdate(){
        this.email = this.email.toLocaleLowerCase().trim();
    }
}
