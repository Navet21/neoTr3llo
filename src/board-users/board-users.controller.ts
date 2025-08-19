import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BoardUsersService } from './board-users.service';
import { CreateBoardUserDto } from './dto/create-board-user.dto';
import { UpdateBoardUserDto } from './dto/update-board-user.dto';
import { Auth } from 'src/auth/decorators';

@Controller('board-users')
@Auth()
export class BoardUsersController {
  constructor(private readonly boardUsersService: BoardUsersService) {}

  @Post()
  create(@Body() createBoardUserDto: CreateBoardUserDto) {
    return this.boardUsersService.create(createBoardUserDto);
  }

  @Get()
  findAll() {
    return this.boardUsersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.boardUsersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBoardUserDto: UpdateBoardUserDto) {
    return this.boardUsersService.update(+id, updateBoardUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.boardUsersService.remove(+id);
  }
}
