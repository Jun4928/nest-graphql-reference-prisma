import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import {
  Comment as CommentFromPrisma,
  User as UserFromPrisma,
} from '@prisma/client';
import { CreateCommentInput } from './dto/input/create-comment.input';

@Injectable()
export class CommentsService {
  constructor(private readonly prisma: PrismaService) {}

  async createComment(
    createCommentData: CreateCommentInput,
    user_id: string,
  ): Promise<CommentFromPrisma> {
    const { content, post_id } = createCommentData;
    return this.prisma.comment.create({
      data: {
        content,
        post_id,
        user_id,
      },
    });
  }

  async getUserFromComment(user_id: string): Promise<UserFromPrisma> {
    return this.prisma.user.findUnique({ where: { id: user_id } });
  }
}
