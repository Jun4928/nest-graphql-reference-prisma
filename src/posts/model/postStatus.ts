import { ObjectType, Field, Int } from '@nestjs/graphql';
import { PostStatus as PostStatusFromPrisma } from '@prisma/client';

@ObjectType()
export class PostStatus implements PostStatusFromPrisma {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;
}
