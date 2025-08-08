import { User } from "src/auth/entities/user.entity";
import { BoardUser } from "src/board-users/entities/board-user.entity";
import { Label } from "src/labels/entities/label.entity";
import { List } from "src/lists/entities/list.entity";
import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity('boards')
export class Board {
    
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    name: string;

    @Column('text')
    description: string;

    //Relationships
    @OneToMany(
        () => BoardUser,
        (boarduser) => boarduser.board
    )
    boardUsers?: BoardUser[]

    @OneToMany(
        () => List,
        List => List.board
    )
    lists?: List[]

    @OneToMany(
        () => Label,
        label => label.board
    )
    labels?: Label[]
}
