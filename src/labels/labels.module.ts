import { Module } from '@nestjs/common';
import { LabelsService } from './labels.service';
import { LabelsController } from './labels.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Label } from './entities/label.entity';

@Module({
  controllers: [LabelsController],
  providers: [LabelsService],
  imports: [
    TypeOrmModule.forFeature([Label])
  ],
})
export class LabelsModule {}
