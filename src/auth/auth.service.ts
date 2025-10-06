import { Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { compareSync } from 'bcrypt'
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService
  ) { }

  async login(loginDto: LoginDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email: loginDto.email }
      })
      if (!user) {
        throw new NotFoundException('No user with that email')
      }
      if (!compareSync(loginDto.password, user.password)) {
        throw new UnauthorizedException('Password is incorrect')
      }
      const payload = { id: user.id, email: user.email }
      return {
        token: this.jwtService.sign(payload)
      }
    } catch (error) {
      throw new InternalServerErrorException({
        error: error.response, message: 'Contact with and admin'
      })
    }
  }
}
