import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BoardUsersService } from './board-users.service';
import { InviteUserToBoardDto } from './dto';
import { Auth, GetUser } from 'src/auth/decorators';
import { CreateBoardDto } from 'src/boards/dto/create-board.dto';
import { User } from 'src/auth/entities/user.entity';

@Controller('board-users')
@Auth()
export class BoardUsersController {
  constructor(private readonly boardUsersService: BoardUsersService) {}

  //Create a board
  @Post()
  async create(@GetUser() user: User, @Body() createBoardDto: CreateBoardDto) {
    return this.boardUsersService.create(createBoardDto, user);
  }

  //Add User to Board
  @Post('invite')
  async inviteUser(
    @GetUser() currentUser: User,
    @Body() inviteUserToBoardDto: InviteUserToBoardDto,
  ) {
    return this.boardUsersService.inviteUserToBoard(
      inviteUserToBoardDto,
      currentUser,
    );
  }

  //Transfer Ownership
  @Post('transfer-ownership')
  async transferOwnership(
    @GetUser() currentUser: User,
    @Body() inviteUserDto: InviteUserToBoardDto,
  ) {
    return this.boardUsersService.transferOwnership(inviteUserDto, currentUser);
  }

  @Get()
  findAllbyUser(@GetUser() currentUser: User) {
    return this.boardUsersService.findAllBoardsByUser(currentUser);
  }

  @Delete()
  removeBoardUser(
    @GetUser() currentUser: User,
    @Body() inviteUserDto: InviteUserToBoardDto,
  ) {
    return this.boardUsersService.removeBoardUser(inviteUserDto, currentUser);
  }

  @Delete('board/:id')
  removeBoard(@Param('id') id: string, @GetUser() currentUser: User) {
    return this.boardUsersService.deleteBoard(id, currentUser);
  }

  @Get(':boardId/users')
  async getUsersByBoard(
    @Param('boardId') boardId: string,
    @GetUser() currentUser: User,
  ) {
    return this.boardUsersService.getBoardUsers(boardId, currentUser);
  }
}
