import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnvConfiguration } from './config/app.config';
import { JoiValidationSchema } from './config/joi.validation';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { FilesModule } from './files/files.module';
import { SeedModule } from './seed/seed.module';
import { CommonModule } from './common/common.module';
import { BoardsModule } from './boards/boards.module';
import { ListsModule } from './lists/lists.module';
import { TasksModule } from './tasks/tasks.module';
import { AttachmentsModule } from './attachments/attachments.module';
import { BoardUsersModule } from './board-users/board-users.module';
import { CommentsModule } from './comments/comments.module';
import { LabelsModule } from './labels/labels.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load:[EnvConfiguration],
      validationSchema:JoiValidationSchema,
    }),
    TypeOrmModule.forRoot({
      type:'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT!,
      database:process.env.DB_NAME,
      username:process.env.DB_USERNAME,
      password:process.env.DB_PASSWORD,
      autoLoadEntities:true,
      //Quit in Production
      synchronize:true
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname,'..','public')
    }),
    AuthModule,
    UsersModule,
    FilesModule,
    SeedModule,
    CommonModule,
    BoardsModule,
    ListsModule,
    TasksModule,
    AttachmentsModule,
    BoardUsersModule,
    CommentsModule,
    LabelsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
