import { Field, GraphQLISODateTime, Int, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional } from 'class-validator';
import type { ObjectId } from 'mongoose';
import { TotalCounter } from '../member/member';

@ObjectType()
export class Program {
  @Field(() => String)
  _id: ObjectId;

  @Field(() => String)
  programName: string;

  @Field(() => GraphQLISODateTime)
  programStartDate: Date;

  @Field(() => GraphQLISODateTime)
  programEndDate: Date;

  @Field(() => Int)
  programMembers: number;

  @Field(() => [String])
  programImages: string[];

  @Field(() => String, { nullable: true })
  programDesc?: string;

  @Field(() => Int)
  programViews: number;

  @Field(() => Int)
  programLikes: number;

  @Field(() => String)
  memberId: ObjectId;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}

@ObjectType()
export class Programs {
  @Field(() => [Program])
  list: Program[];

  @Field(() => [TotalCounter], { nullable: true })
  metaCounter: TotalCounter[];
}
