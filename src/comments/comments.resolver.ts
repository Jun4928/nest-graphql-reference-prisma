import {
  Args,
  Mutation,
  Parent,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { CommentsService } from './comments.service';
import { Comment } from './model/comment';
import { User } from 'src/users/model/user';
import { Comment as CommentFromPrisma } from '@prisma/client';
import { CreateCommentInput } from './dto/input/create-comment.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorator/CurrentUser';
import { TokenPayload } from 'src/auth/model/tokenPayload';

@Resolver(() => Comment)
export class CommentsResolver {
  constructor(private readonly commentsService: CommentsService) {}

  @ResolveField()
  async writer(@Parent() commentFromPrisma: CommentFromPrisma): Promise<User> {
    const { user_id } = commentFromPrisma;
    return this.commentsService.getUserFromComment(user_id);
  }

  @Mutation(() => Comment)
  @UseGuards(JwtAuthGuard)
  createComment(
    @CurrentUser() currentUser: TokenPayload,
    @Args('createCommentData') createCommentData: CreateCommentInput,
  ): Promise<CommentFromPrisma> {
    const { id: user_id } = currentUser;
    return this.commentsService.createComment(createCommentData, user_id);
  }
}
