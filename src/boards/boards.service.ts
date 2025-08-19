import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from './entities/board.entity';
import { Repository } from 'typeorm';
import { isUUID } from 'class-validator';
import { User } from 'src/auth/entities/user.entity';

@Injectable()

export class BoardsService {
  private readonly logger = new Logger('BoardsService');

  constructor(
    @InjectRepository(Board)
    private readonly boardRepository : Repository<Board>
  ){}
  
  async createBoard(createBoardDto: CreateBoardDto) {
    try{
      const board = this.boardRepository.create(createBoardDto)
      await this.boardRepository.save(board);
      return board
    } catch(error){
      this.handleDBExceptions(error)
    }
  }

  async findOne(id: string) {
    try {
      const board = await this.boardRepository.findOneBy({ id });

    if (!board) {
      throw new NotFoundException (`Board with id ${id} not found`)
    }

    return board;
    } catch (error) {
      this.handleDBExceptions(error)
    }
    
}

  async update(id: string, updateBoardDto: UpdateBoardDto) {
    const board = await this.boardRepository.preload({
      id:id,
      ...updateBoardDto
    })
    if( !board) throw new NotFoundException(`Board with id ${id} not found`);
    await this.boardRepository.save(board);
    return board
  }

  async remove(id: string) {
    const board = await this.findOne(id);
    await this.boardRepository.delete(id);
    return `Board ${board?.name} deleted successfully`
  }


  private handleDBExceptions(error : any){
    if( error.code === '23505' ){
        throw new BadRequestException(error.detail)
      }
      this.logger.error(error);
      throw new InternalServerErrorException('Unexpected error, check server logs')
  }
}
