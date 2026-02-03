// libs/dto/comment/comment.input.ts
import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, Length } from 'class-validator';
import { CommentGroup } from '../../enums/comment.enum';

@InputType()
export class CommentInput {
  @IsNotEmpty()
  @Field(() => String)
  commentRefId: string;

  @IsNotEmpty()
  @Field(() => CommentGroup)
  commentGroup: CommentGroup;

  @IsNotEmpty()
  @Length(1, 500)
  @Field(() => String)
  commentContent: string;
}
