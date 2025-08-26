import { User } from 'src/auth/entities/user.entity';
import { Board } from 'src/boards/entities/board.entity';
import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Index(['board', 'user'], { unique: true }) //Avoid duplicity
@Entity('board_users')
export class BoardUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('bool', {
    default: false,
  })
  isOwner: boolean;

  @ManyToOne(() => User, (user) => user.boardUsers, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Board, (board) => board.boardUsers, { onDelete: 'CASCADE' })
  board: Board;
}
