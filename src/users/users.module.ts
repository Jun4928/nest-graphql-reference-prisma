import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [PrismaService, UsersResolver, UsersService],
})
export class UsersModule {}
