import { Module } from '@nestjs/common';
import { BoardUsersService } from './board-users.service';
import { BoardUsersController } from './board-users.controller';
import { BoardUser } from './entities/board-user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [BoardUsersController],
  providers: [BoardUsersService],
  imports: [
      TypeOrmModule.forFeature([BoardUser])
    ]
})
export class BoardUsersModule {}
