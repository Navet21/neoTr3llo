import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { BoardsService } from 'src/boards/boards.service';
import { CreateBoardDto } from 'src/boards/dto/create-board.dto';
import { CreateUserDto } from 'src/auth/dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BoardUser } from './entities/board-user.entity';
import { Repository } from 'typeorm';
import { InviteUserToBoardDto } from './dto/invite-user-to-board.dto';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/auth/entities/user.entity';
import {
  checkOwner,
  getBoardUser,
  checkUser,
} from './helpers/board-user-helpers';

@Injectable()
export class BoardUsersService {
  private readonly logger = new Logger('BoardsUsersService');
  constructor(
    @InjectRepository(BoardUser)
    private readonly boardUserRepository: Repository<BoardUser>,
    private readonly boardsService: BoardsService,
    private readonly usersService: UsersService,
  ) {}

  async create(createBoardDto: CreateBoardDto, user: CreateUserDto) {
    try {
      const board = await this.boardsService.createBoard(createBoardDto);
      const boardUser = this.boardUserRepository.create({
        board,
        user,
        isOwner: true,
      });
      await this.boardUserRepository.save(boardUser);
      return boardUser;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  //Invite User to Board
  async inviteUserToBoard(
    userInvited: InviteUserToBoardDto,
    currentUser: User,
  ) {
    const { userId, boardId } = userInvited;

    await checkOwner(this.boardUserRepository, boardId, currentUser.id);

    // Check if the relationships already exists to avoid duplicity
    const existing = await getBoardUser(
      this.boardUserRepository,
      boardId,
      userId,
    );
    if (existing) return existing;

    const board = await this.boardsService.findOne(boardId);
    const invitedUser = await this.usersService.findOne(userId);

    const newBoardUser = this.boardUserRepository.create({
      board,
      user: invitedUser,
      isOwner: false,
    });
    await this.boardUserRepository.save(newBoardUser);
    return newBoardUser;
  }

  //Transfer board Ownership
  async transferOwnership(
    inviteUserDto: InviteUserToBoardDto,
    currentUser: User,
  ) {
    const { boardId, userId } = inviteUserDto;

    const currentOwner = await checkOwner(
      this.boardUserRepository,
      boardId,
      currentUser.id,
    );

    const target = await checkUser(this.boardUserRepository, boardId, userId);

    if (target.isOwner) {
      return {
        message: 'User is already an owner',
        boardId,
        newOwnerId: userId,
      };
    }

    currentOwner.isOwner = false;
    target.isOwner = true;
    await this.boardUserRepository.save([currentOwner, target]);

    return {
      message: 'Ownership transferred successfully',
      boardId,
      newOwnerId: userId,
    };
  }

  async findAllBoardsByUser(currentUser: User) {
    const boards = await this.boardUserRepository.find({
      where: {
        user: { id: currentUser.id },
      },
      relations: ['board'],
    });
    return boards;
  }

  //Delete BoardUser

  async removeBoardUser(
    inviteUserDto: InviteUserToBoardDto,
    currentUser: User,
  ) {
    const { boardId, userId } = inviteUserDto;

    // Check if the user is a collaborator in this board
    const deletedUser = await checkUser(
      this.boardUserRepository,
      boardId,
      currentUser.id,
    );
    //Check if the connected user wants to leave the board
    if (currentUser.id === userId) {
      if (deletedUser.isOwner) {
        throw new ForbiddenException(
          'Owners cannot leave the board. Transfer ownership first.',
        );
      }
      await this.boardUserRepository.remove(deletedUser);
      return { message: 'You left the board', boardId, userId };
    }

    await checkOwner(this.boardUserRepository, boardId, currentUser.id);

    const target = await checkUser(this.boardUserRepository, boardId, userId);
    if (target.isOwner) {
      throw new ForbiddenException('You cannot remove the owner');
    }

    await this.boardUserRepository.remove(target);
    return { message: 'User removed', boardId, userId };
  }

  findOne(id: number) {
    return `This action returns a #${id} boardUser`;
  }

  //Delete Board

  async deleteBoard(boardId: string, currentUser: User) {
    await checkOwner(this.boardUserRepository, boardId, currentUser.id);
    await this.boardsService.remove(boardId);

    return { message: `Board ${boardId} deleted successfully` };
  }

  //Get all users by board

  async getBoardUsers(boardId: string, currentUser: User) {
    await checkUser(this.boardUserRepository, boardId, currentUser.id);

    const rows = await this.boardUserRepository.find({
      where: {
        board: { id: boardId },
        user: { isActive: true },
      },
      relations: { user: true },
      select: {
        id: true,
        isOwner: true,
        user: {
          id: true,
          email: true,
          fullName: true,
        },
      },
      order: { isOwner: 'DESC' },
    });

    return rows.map((user) => ({
      boardUserId: user.id,
      isOwner: user.isOwner,
      user: {
        id: user.user.id,
        email: user.user.email,
        fullName: user.user.fullName,
      },
    }));
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }
    this.logger.error(error);
    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }

  //TODO: All users for board
}
