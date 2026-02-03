// libs/dto/feedback/feedback.update.ts
import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, Length } from 'class-validator';
import { FeedbackScale } from '../../enums/feedback.enum';

@InputType()
export class FeedbackUpdate {
  @IsNotEmpty()
  @Field(() => String)
  _id: string;

  @IsOptional()
  @Field(() => FeedbackScale, { nullable: true })
  feedbackScale?: FeedbackScale;

  @IsOptional()
  @Length(10, 500)
  @Field(() => String, { nullable: true })
  feedbackContent?: string;
}
