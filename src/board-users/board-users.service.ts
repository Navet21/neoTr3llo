import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { BoardsService } from 'src/boards/boards.service';
import { CreateBoardDto } from 'src/boards/dto/create-board.dto';
import { CreateUserDto } from 'src/auth/dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BoardUser } from './entities/board-user.entity';
import { Repository } from 'typeorm';
import { InviteUserToBoardDto } from './dto/invite-user-to-board.dto';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class BoardUsersService {
  private readonly logger = new Logger('BoardsUsersService');
  constructor(
    @InjectRepository(BoardUser)
    private readonly boardUserRepository : Repository<BoardUser>,
    private readonly boardsService: BoardsService,
    private readonly usersService: UsersService,
    
  ) {}


  async create(createBoardDto: CreateBoardDto, user: CreateUserDto) {    
    try{
      const board = await this.boardsService.createBoard(createBoardDto)
      const boardUser = this.boardUserRepository.create({
        board,
        user,
        isOwner: true
      })
      await this.boardUserRepository.save(boardUser);
      return boardUser
    } catch(error){
      this.handleDBExceptions(error)
    }
  }

  //Invite User to Board
  async inviteUserToBoard(userInvited: InviteUserToBoardDto,currentUser: User){
    const {userId, boardId} = userInvited
    const board = await this.boardsService.findOne(boardId)

    const currentBoardUser = await this.boardUserRepository.findOneBy({
      board: {id: boardId},
      user: {id: currentUser.id},
    });

    if (!currentBoardUser || !currentBoardUser.isOwner){
      throw new ForbiddenException ('Only the owner can invite others users')
    }

    const invitedUser = await this.usersService.findOne(userId);

    const newBoardUser = this.boardUserRepository.create({
      board,
      user:invitedUser,
      isOwner: false
    })
    await this.boardUserRepository.save(newBoardUser)
    return newBoardUser
  }

  //Transfer board Ownership
  async transferOwnership(inviteUserDto : InviteUserToBoardDto, currentUser : User){
    const {boardId,userId} = inviteUserDto
    const board = await this.boardsService.findOne(boardId);

    const currentBoardUser = await this.boardUserRepository.findOneBy({
      board: {id: boardId},
      user: {id: currentUser.id},
    });
    if (!currentBoardUser || !currentBoardUser.isOwner){
      throw new ForbiddenException ('Only the owner can transfer the board')
    }

    const newBoardOwner = await this.boardUserRepository.findOneBy({
      board: { id: boardId},
      user: { id: userId}
    })

    if (!newBoardOwner){
      throw new NotFoundException('The new owner must be a member of the board!')
    }
    
    currentBoardUser.isOwner = false;
    newBoardOwner.isOwner = true;
    await this.boardUserRepository.save([currentBoardUser, newBoardOwner]);

    return { message: 'Ownership transferred successfully'}

  }

  async findAllBoardsByUser(currentUser: User) {
    const boards = await this.boardUserRepository.find({
      where:{
        user: {id: currentUser.id}
      },
      relations: ['board']
    })
    return boards
  }

  //Delete Board
  //TODO : Delete
  remove(id: number) {
    return `This action removes a #${id} boardUser`;
  }

  findOne(id: number) {
    return `This action returns a #${id} boardUser`;
  }

  

  private handleDBExceptions(error : any){
    if( error.code === '23505' ){
      throw new BadRequestException(error.detail)
    }
    this.logger.error(error);
      throw new InternalServerErrorException('Unexpected error, check server logs')
    }
}
