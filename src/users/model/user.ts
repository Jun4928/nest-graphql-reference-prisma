import { Field, ObjectType } from '@nestjs/graphql';
import { User as UserWithPassword } from '@prisma/client';

type UserWithoutPassword = Omit<UserWithPassword, 'password'>;

@ObjectType()
export class User implements UserWithoutPassword {
  @Field()
  id: string;

  @Field()
  email: string;

  @Field()
  created_at: Date;

  @Field({ nullable: true })
  updated_at: Date | null;

  @Field({ nullable: true })
  deleted_at: Date | null;
}
