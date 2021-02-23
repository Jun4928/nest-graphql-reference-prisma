import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateUserInput } from './dto/input/create-user.input';
import { User as UserWithPassword } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserById(id: string): Promise<UserWithPassword | undefined> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async getUserByEmail(email: string): Promise<UserWithPassword | undefined> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async createUser({
    email,
    password,
  }: CreateUserInput): Promise<UserWithPassword> {
    return this.prisma.user.create({ data: { email, password } });
  }
}
