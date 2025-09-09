import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';

import { User } from './entities/user.entity';

import * as bcrypt from 'bcrypt';
import { LoginUserDto, CreateUserDto } from './dto';
import { JwtPayload } from './interfaces';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      //Primero tenemos que separar la contraseña con el resto de datos del user
      const { password, ...userData } = createUserDto;
      //Ahora asignamos la contraseña hasheada utilizando la funcion hashSync
      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
      });
      await this.userRepository.save(user);
      return {
        ...user,
        token: this.getJWtToken({ id: user.id }),
      };
    } catch (error) {
      this.handleDBerrors(error);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    //Primero desestructuramos el dto
    const { password, email } = loginUserDto;
    //Ahora buscamos a un usuario con el email
    const user = await this.userRepository.findOne({
      where: { email },
      select: { email: true, password: true, id: true },
    });
    //Validación de que existe el usuario
    if (!user) {
      throw new UnauthorizedException('Credentials are not valid (email)');
    }
    //Si existe el usuario comparamos las contraseñas
    if (!bcrypt.compareSync(password, user.password)) {
      throw new UnauthorizedException('Credentials are not valid (password)');
    }

    return {
      ...user,
      token: this.getJWtToken({ id: user.id }),
    };
  }

  async checkAuthStatus(user: User) {
    return {
      ...user,
      token: this.getJWtToken({ id: user.id }),
    };
  }

  private getJWtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  private handleDBerrors(error: any): never {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }
    console.log(error);
    throw new InternalServerErrorException('Please check server logs');
  }
}
