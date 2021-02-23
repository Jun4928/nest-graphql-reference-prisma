import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { CreatePostInput } from './create-post.input';

@InputType()
export class UpdatePostInput extends CreatePostInput {
  @Field()
  @IsNotEmpty()
  id: string;
}
