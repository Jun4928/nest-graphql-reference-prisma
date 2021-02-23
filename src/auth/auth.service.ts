import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Token } from './model/token';
import { User as UserWithPassword } from '@prisma/client';
import { LoginArgs } from 'src/users/dto/args/login-by-email.args';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async validateUser({
    email,
    password,
  }: LoginArgs): Promise<UserWithPassword | undefined> {
    const foundUser = await this.prisma.user.findUnique({ where: { email } });
    if (!foundUser) return undefined;

    const { password: hashedPassword } = foundUser;

    const isValidPassword = await bcrypt.compare(password, hashedPassword);
    if (!isValidPassword) return undefined;

    return foundUser;
  }

  login(user: UserWithPassword): Token {
    const payload = { email: user.email, id: user.id };
    return {
      value: this.jwtService.sign(payload),
    };
  }

  async hashPassword(password: string) {
    return bcrypt.hash(password, 10);
  }
}
