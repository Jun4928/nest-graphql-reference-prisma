import { Field, ObjectType } from '@nestjs/graphql';
import { Post as PostFromPrisma } from '@prisma/client';
import { User } from '../../users/model/user';
import { PostStatus } from './postStatus';

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
}
