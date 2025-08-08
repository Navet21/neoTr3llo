import { Module } from '@nestjs/common';
import { ListsService } from './lists.service';
import { ListsController } from './lists.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { List } from './entities/list.entity';

@Module({
  controllers: [ListsController],
  providers: [ListsService],
  imports: [
    TypeOrmModule.forFeature([List])
  ]
})
export class ListsModule {}
