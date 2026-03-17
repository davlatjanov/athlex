// libs/dto/trainingProgram/programEnrollment.ts
import { Field, Int, ObjectType } from '@nestjs/graphql';
import type { ObjectId } from 'mongoose';

@ObjectType()
export class ProgramEnrollment {
  @Field(() => String)
  _id: ObjectId;

  @Field(() => String)
  memberId: ObjectId;

  @Field(() => String)
  programId: ObjectId;

  @Field(() => Date)
  enrolledAt: Date;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}

@ObjectType()
export class StudentEntry {
  @Field(() => String)
  memberId: ObjectId;

  @Field(() => String)
  memberNick: string;

  @Field(() => String, { nullable: true })
  memberImage?: string;

  @Field(() => String, { nullable: true })
  memberFullName?: string;

  @Field(() => String)
  programId: ObjectId;

  @Field(() => String)
  programName: string;

  @Field(() => Date)
  enrolledAt: Date;
}

@ObjectType()
export class Students {
  @Field(() => [StudentEntry])
  list: StudentEntry[];

  @Field(() => Int)
  total: number;
}
