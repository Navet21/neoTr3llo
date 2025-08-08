
import { Board } from "src/boards/entities/board.entity";
import { Task } from "src/tasks/entities/task.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity('lists')
export class List {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('')
    title: string;

    //Relationships
    @ManyToOne(
        () => Board,
        (board) => board.lists,
        { onDelete: 'CASCADE' }
    )
    board: Board

    @OneToMany(
        () => Task,
        Task => Task.list
    )
    tasks?: Task[]
}
