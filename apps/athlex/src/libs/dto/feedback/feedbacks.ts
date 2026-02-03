// libs/dto/feedback/feedbacks.ts
import { Field, ObjectType } from '@nestjs/graphql';
import { Feedback } from './feedback';
import { TotalCounter } from '../member/member';

@ObjectType()
export class Feedbacks {
  @Field(() => [Feedback])
  list: Feedback[];

  @Field(() => [TotalCounter], { nullable: true })
  metaCounter: TotalCounter[];
}
