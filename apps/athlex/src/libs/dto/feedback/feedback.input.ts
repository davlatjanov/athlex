// libs/dto/feedback/feedback.input.ts
import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, Length } from 'class-validator';
import { FeedbackGroup, FeedbackScale } from '../../enums/feedback.enum';

@InputType()
export class FeedbackInput {
  @IsNotEmpty()
  @Field(() => String)
  feedbackRefId: string;

  @IsNotEmpty()
  @Field(() => FeedbackGroup)
  feedbackGroup: FeedbackGroup;

  @IsNotEmpty()
  @Field(() => FeedbackScale)
  feedbackScale: FeedbackScale;

  @IsNotEmpty()
  @Length(10, 500)
  @Field(() => String)
  feedbackContent: string;
}
