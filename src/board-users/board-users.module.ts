import { Module } from '@nestjs/common';
import { BoardUsersService } from './board-users.service';
import { BoardUsersController } from './board-users.controller';
import { BoardUser } from './entities/board-user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [BoardUsersController],
  providers: [BoardUsersService],
  imports: [
      TypeOrmModule.forFeature([BoardUser]),
      AuthModule,
  ]
})
export class BoardUsersModule {}
