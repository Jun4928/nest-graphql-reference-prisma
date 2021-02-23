import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsPositive, Max } from 'class-validator';

@InputType()
export class CreatePostInput {
  @Field()
  @IsNotEmpty()
  title: string;

  @Field()
  @IsNotEmpty()
  body: string;

  @Field(() => Int)
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Max(2)
  post_status_id: number;
}
