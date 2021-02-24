import { Field, ObjectType } from '@nestjs/graphql';
import { Post as PostFromPrisma } from '@prisma/client';
import { User } from '../../users/model/user';
import { PostStatus } from './postStatus';
import { Comment } from '../../comments/model/comment';

type PostWithUserAndPostStatus = Omit<
  PostFromPrisma,
  'user_id' | 'post_status_id'
>;

@ObjectType()
export class Post implements PostWithUserAndPostStatus {
  @Field()
  id: string;

  @Field()
  title: string;

  @Field()
  body: string;

  @Field()
  created_at: Date;

  @Field({ nullable: true })
  updated_at: Date | null;

  @Field({ nullable: true })
  deleted_at: Date | null;

  @Field(() => User)
  writer: User;

  @Field(() => PostStatus)
  postStatus: PostStatus;

  @Field(() => [Comment], { nullable: 'items' })
  comments: Comment[];
}
