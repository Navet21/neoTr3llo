import { Board } from "src/boards/entities/board.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('labels')
export class Label {
    
    @PrimaryGeneratedColumn('uuid')
    id: string;
        
    @Column('text')
    name: string;

    @Column('text')
    color: string;

    //Relationships

    @ManyToOne(
        () => Board,  
        (board) => board.labels
    )
    board: Board
}
