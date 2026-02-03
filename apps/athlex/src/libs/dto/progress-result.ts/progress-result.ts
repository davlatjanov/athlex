// libs/dto/progress-result/progress-result.ts
import { Field, Int, ObjectType } from '@nestjs/graphql';
import type { ObjectId } from 'mongoose';
import { ProgressResultStatus } from '../../enums/progress-result.enum';
import { Member } from '../member/member';
import { TotalCounter } from '../member/member';

@ObjectType()
export class ProgressResult {
  @Field(() => String)
  _id: ObjectId;

  @Field(() => String)
  memberId: ObjectId;

  @Field(() => String)
  programId: ObjectId;

  @Field(() => String)
  trainerId: ObjectId;

  @Field(() => [String])
  images: string[];

  @Field(() => String)
  content: string;

  @Field(() => ProgressResultStatus)
  status: ProgressResultStatus;

  @Field(() => Member, { nullable: true })
  memberData?: Member;

  @Field(() => Member, { nullable: true })
  trainerData?: Member;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}

@ObjectType()
export class ProgressResults {
  @Field(() => [ProgressResult])
  list: ProgressResult[];

  @Field(() => [TotalCounter], { nullable: true })
  metaCounter: TotalCounter[];
}
