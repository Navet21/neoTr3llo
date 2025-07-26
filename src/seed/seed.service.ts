import { Injectable } from '@nestjs/common';
import { User } from 'src/auth/entities/user.entity';
import { initialData } from './data/seed-data';
import { UsersService } from 'src/users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';


@Injectable()
export class SeedService {
  
  constructor(
    private readonly userService: UsersService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async runSeed(){
    //creamos los usuarios
    const adminUser = await this.insertUsers()
    return 'Seed executed'
  }

  private async insertUsers(){
    this.userService.deleteAllUsers()
    const seedUsers = initialData.users;
    //Creamos un array de users vacio
    const users : User[] = [];
    //hacemos un foir each que por cada usuario pushee el usuario ya creado, pero no guardado
    seedUsers.forEach( user => {
      user.password = bcrypt.hashSync(user.password, 10)
      users.push(this.userRepository.create(user))
    });
    //ahora guardamos los users
    const dbUsers = await this.userRepository.save( users)
    return dbUsers
  }
}
