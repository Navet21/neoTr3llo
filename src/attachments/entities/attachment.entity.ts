import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { AttachmentType } from "../enums/attachments-type";
import { Task } from "src/tasks/entities/task.entity";

@Entity('attachments')
export class Attachment {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    name: string;

    @Column({
        type: "enum",
        enum: AttachmentType
    })
    type: AttachmentType;

    @Column('text')
    url: string


    @ManyToOne(
        () => Task,
        (task) => task.attachments,
        { onDelete : 'CASCADE' }
    )
    task: Task
}
