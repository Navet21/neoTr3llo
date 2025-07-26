import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { CreateUserDto, UpdateUserDto } from 'src/auth/dto';
import { User } from 'src/auth/entities/user.entity';
import { isUUID } from 'class-validator';
import { PaginationDto } from 'src/common/pagination.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger('UsersService');
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  //Create User by Admin
  async create(createUserDto: CreateUserDto) {
    createUserDto.email = createUserDto.email.toLowerCase();
    const { password, ...userData } = createUserDto;
    try {
      const user = await this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
      });
      await this.userRepository.save(user);
      return user;
    } catch (error: any) {
      console.error(error);
      throw new InternalServerErrorException(
        `Can't create User - Check server logs`,
      );
    }
  }

  //Find all Users Paginated
  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    const users = await this.userRepository.find({
      take: limit,
      skip: offset,
    });
    return users;
  }

  //Find User by email or id
  async findOne(term: string) {
    let user: User | null = null;
    //Uuid
    if (!user && isUUID(term)) {
      user = await this.userRepository.findOne({ where: { id: term } });
    }
    //Email
    if (!user) {
      user = await this.userRepository.findOne({
        where: { email: term.toLowerCase().trim() },
      });
    }
    if (!user) {
      throw new NotFoundException(`User with id or email ${term} not found`);
    }
    return user;
  }

  //Update User
  async update(term: string, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.findOne(term);
      Object.assign(user, updateUserDto);
      if (updateUserDto.email) {
        user.email = updateUserDto.email.toLowerCase().trim();
      }
      const updatedUser = await this.userRepository.save(user);
      return updatedUser;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  //Delete User
  async remove(id: string) {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new BadRequestException(`User with id ${id} not found`);
    }
    return `User with id ${id} successfully deleted.`;
  }

  //Delete all Users
  async deleteAllUsers() {
    const query = this.userRepository.createQueryBuilder('user');
    try {
      return await query.delete().where({}).execute();
    } catch (error) {
      this.handleDBExceptions(error);
    }
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
}
