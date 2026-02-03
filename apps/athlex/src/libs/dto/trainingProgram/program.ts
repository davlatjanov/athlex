import { Field, Int, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional } from 'class-validator';
import type { ObjectId } from 'mongoose';

@ObjectType()
export class Program {
  @Field(() => String)
  _id: ObjectId;

  @Field(() => String)
  programName: string;

  @Field(() => Date)
  programStartDate: Date;

  @Field(() => Date)
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
