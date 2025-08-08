import { Attachment } from "src/attachments/entities/attachment.entity";
import { User } from "src/auth/entities/user.entity";
import { Comment } from "src/comments/entities/comment.entity";
import { List } from "src/lists/entities/list.entity";
import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('tasks')
export class Task {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @Column('text')
    title: string;
    
    @Column('text')
    description: string;

    @Column('bool',{
        default: false
    })
    isBlocked: boolean;
    
    //Relationships
    @ManyToOne(
        () => List,
        (list) => list.tasks
    )
    list: List
    
    @ManyToMany(
        () => User,
        (user) => user.tasks
    )
    users?: User[]

    @OneToMany(
        () => Attachment,
        (attachment) => attachment.task
    )
    attachments: Attachment[]

    @OneToMany(
        () => Comment,
        (comment) => comment.task
    )
    comments?: Comment[]
}
