import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaService } from 'src/prisma.service';
import { CommentsResolver } from './comments.resolver';
import { CommentsService } from './comments.service';

@Module({
  imports: [AuthModule],
  providers: [PrismaService, CommentsResolver, CommentsService],
})
export class CommentsModule {}
