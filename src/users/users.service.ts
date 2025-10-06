import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import { hashSync } from 'bcrypt'

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService
  ) { }
  async create(createUserDto: CreateUserDto) {
    try {
      await this.prisma.user.create({
        data: {
          id: uuidv4().toString(),
          email: createUserDto.email,
          password: hashSync(createUserDto.password, 10)
        }
      })
      return { message: 'New user was created' };
    } catch (error) {
      throw new InternalServerErrorException(
        {
          error: error.response,
          message: 'Contact with an admin'
        }
      )
    }
  }

  async findAll() {
    const users = await this.prisma.user.findMany()
    if (users.length <= 0) {
      throw new NotFoundException('There are not users')
    }
    return users;
  }
}
