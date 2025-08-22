import { Module } from '@nestjs/common';
import { BoardUsersService } from './board-users.service';
import { BoardUsersController } from './board-users.controller';
import { BoardUser } from './entities/board-user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { BoardsModule } from 'src/boards/boards.module';
import { Board } from 'src/boards/entities/board.entity';
import { BoardsService } from 'src/boards/boards.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [BoardUsersController],
  providers: [BoardUsersService],
  imports: [
      TypeOrmModule.forFeature([BoardUser,Board]),
      AuthModule,
      BoardsModule,
      UsersModule,
  ],
})
export class BoardUsersModule {}
