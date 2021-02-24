import { Field, ObjectType } from '@nestjs/graphql';
import { Comment as CommentFromPrisma } from '@prisma/client';
import { User } from 'src/users/model/user';

@ObjectType()
export class Comment implements Omit<CommentFromPrisma, 'post_id' | 'user_id'> {
  @Field()
  id: string;

  @Field()
  content: string;

  @Field()
  created_at: Date;

  @Field({ nullable: true })
  updated_at: Date | null;

  @Field({ nullable: true })
  deleted_at: Date | null;

  @Field(() => User)
  writer: User;
}
