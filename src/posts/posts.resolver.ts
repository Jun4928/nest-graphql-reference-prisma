import {
  Resolver,
  Args,
  Mutation,
  Query,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { Post } from './model/post';
import { User } from 'src/users/model/user';
import { PostStatus } from './model/postStatus';
import { Post as PostFromPrisma } from '@prisma/client';
import { PostsService } from './posts.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorator/CurrentUser';
import { TokenPayload } from 'src/auth/model/tokenPayload';
import { CreatePostInput } from './dto/input/create-post.input';
import { UpdatePostInput } from './dto/input/update-post.input';
import { DeletePostInput } from './dto/input/delete-post.input';

@Resolver(() => Post)
export class PostsResolver {
  constructor(private readonly postsService: PostsService) {}

  @Query(() => [Post], { name: 'posts', nullable: 'items' })
  async getPosts(): Promise<PostFromPrisma[]> {
    return this.postsService.getPosts();
  }

  @ResolveField()
  async writer(@Parent() postFromPrisma: PostFromPrisma): Promise<User> {
    const { id } = postFromPrisma;
    return this.postsService.getUserFromPost(id);
  }

  @ResolveField()
  async postStatus(
    @Parent() postFromPrisma: PostFromPrisma,
  ): Promise<PostStatus> {
    const { id } = postFromPrisma;
    return this.postsService.getPostStatusFromPost(id);
  }

  @Mutation(() => Post)
  @UseGuards(JwtAuthGuard)
  async createPost(
    @CurrentUser() currentUser: TokenPayload,
    @Args('createPostData') createPostData: CreatePostInput,
  ): Promise<PostFromPrisma> {
    const { id: user_id } = currentUser;
    return this.postsService.createPost(createPostData, user_id);
  }

  @Mutation(() => Post)
  @UseGuards(JwtAuthGuard)
  async updatePost(
    @CurrentUser() currentUser: TokenPayload,
    @Args('updatePostData') updatePostData: UpdatePostInput,
  ): Promise<PostFromPrisma> {
    const { id: user_id } = currentUser;
    const { id: post_id } = updatePostData;

    const foundPost = await this.postsService.getPostById(post_id);
    if (!foundPost) throw new NotFoundException();
    if (foundPost.deleted_at) throw new BadRequestException('Already deleted');

    const isUserValid = user_id === foundPost.user_id;
    if (!isUserValid) throw new ForbiddenException();

    return this.postsService.updatePost(updatePostData);
  }

  @Mutation(() => Post)
  @UseGuards(JwtAuthGuard)
  async deletePost(
    @CurrentUser() currentUser: TokenPayload,
    @Args('deletePostInput') deletePostInput: DeletePostInput,
  ): Promise<PostFromPrisma> {
    const { id: user_id } = currentUser;
    const { id: post_id } = deletePostInput;

    const foundPost = await this.postsService.getPostById(post_id);
    if (!foundPost) throw new NotFoundException();
    if (foundPost.deleted_at) throw new BadRequestException('Already deleted');

    const isUserValid = user_id === foundPost.user_id;
    if (!isUserValid) throw new ForbiddenException();

    return this.postsService.deletePost(deletePostInput);
  }
}
