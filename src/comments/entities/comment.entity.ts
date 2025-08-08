import { User } from "src/auth/entities/user.entity";
import { Task } from "src/tasks/entities/task.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('comments')
export class Comment {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @Column('text')
    content: string;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt?: Date;

    @ManyToOne(
        () => Task,
        (task) => task.comments,
        { onDelete : 'CASCADE' }
    )
    task: Task

    @ManyToOne(
        () => User,
        (user) => user.comments,
        { onDelete : 'CASCADE' }
    )
    user: User
}
