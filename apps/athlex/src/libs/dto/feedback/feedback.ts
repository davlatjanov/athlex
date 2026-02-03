// libs/dto/feedback/feedback.ts
import { Field, Int, ObjectType } from '@nestjs/graphql';
import type { ObjectId } from 'mongoose';
import { FeedbackGroup, FeedbackScale } from '../../enums/feedback.enum';
import { Member } from '../member/member';

@ObjectType()
export class Feedback {
  @Field(() => String)
  _id: ObjectId;

  @Field(() => String)
  feedbackContent: string;

  @Field(() => FeedbackScale)
  feedbackScale: FeedbackScale;

  @Field(() => FeedbackGroup)
  feedbackGroup: FeedbackGroup;

  @Field(() => String)
  feedbackRefId: ObjectId;

  @Field(() => String)
  memberId: ObjectId;

  @Field(() => Member, { nullable: true })
  memberData?: Member;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}
