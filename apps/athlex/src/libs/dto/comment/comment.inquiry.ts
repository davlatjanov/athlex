// libs/dto/comment/comment.inquiry.ts
import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, Min } from 'class-validator';
import { CommentGroup } from '../../enums/comment.enum';
import { Direction } from '../../enums/common.enum';

@InputType()
export class CommentInquiry {
  @IsNotEmpty()
  @Min(1)
  @Field(() => Int)
  page: number;

  @IsNotEmpty()
  @Min(1)
  @Field(() => Int)
  limit: number;

  @IsOptional()
  @Field(() => String, { nullable: true })
  sort?: string;

  @IsOptional()
  @Field(() => Direction, { nullable: true })
  direction?: Direction;

  @IsNotEmpty()
  @Field(() => String)
  commentRefId: string;

  @IsNotEmpty()
  @Field(() => CommentGroup)
  commentGroup: CommentGroup;
}
