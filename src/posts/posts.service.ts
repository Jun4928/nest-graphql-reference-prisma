import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Post as PostFromPrisma } from '@prisma/client';
import { CreatePostInput } from './dto/input/create-post.input';
import { UpdatePostInput } from './dto/input/update-post.input';
import { DeletePostInput } from './dto/input/delete-post.input';

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  async getPostById(id: string): Promise<PostFromPrisma | undefined> {
    return this.prisma.post.findUnique({ where: { id } });
  }

  async getPosts(): Promise<PostFromPrisma[]> {
    return this.prisma.post.findMany({
      where: { deleted_at: null },
      orderBy: { created_at: 'desc' },
    });
  }

  async createPost(
    createPostData: CreatePostInput,
    user_id: string,
  ): Promise<PostFromPrisma> {
    return this.prisma.post.create({
      data: { ...createPostData, user_id },
    });
  }

  async updatePost(updatePostData: UpdatePostInput): Promise<PostFromPrisma> {
    const { id, ...data } = updatePostData;
    return this.prisma.post.update({
      where: { id },
      data: {
        ...data,
        updated_at: new Date(),
      },
    });
  }

  async deletePost(deletePostData: DeletePostInput): Promise<PostFromPrisma> {
    const { id } = deletePostData;
    return this.prisma.post.update({
      where: { id },
      data: {
        deleted_at: new Date(),
      },
    });
  }

  async getUserFromPost(id: string) {
    return this.prisma.post.findUnique({ where: { id } }).user();
  }

  async getPostStatusFromPost(id: string) {
    return this.prisma.post.findUnique({ where: { id } }).post_status();
  }
}
