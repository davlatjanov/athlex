// libs/dto/feedback/feedback.inquiry.ts
import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, Min } from 'class-validator';
import { FeedbackGroup } from '../../enums/feedback.enum';
import { Direction } from '../../enums/common.enum';

@InputType()
export class FeedbackInquiry {
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
  feedbackRefId: string;

  @IsNotEmpty()
  @Field(() => FeedbackGroup)
  feedbackGroup: FeedbackGroup;
}
