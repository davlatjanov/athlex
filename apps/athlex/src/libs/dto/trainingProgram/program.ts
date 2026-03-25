// libs/training-program/training-program.ts

import { Field, GraphQLISODateTime, Int, ObjectType } from '@nestjs/graphql';
import type { ObjectId } from 'mongoose';
import { TotalCounter } from '../member/member';
import { Equipment, ExerciseLevel } from '../../enums/exercise.enum';
import {
  ProgramLevel,
  ProgramStatus,
  ProgramType,
} from '../../enums/training-program.enum';
import { BodyPart } from '../../enums/workout.enum';

// ==================== MEMBER DATA (Nested) ====================
@ObjectType()
export class MemberData {
  @Field(() => String)
  _id: ObjectId;

  @Field(() => String)
  memberNick: string;

  @Field(() => String, { nullable: true })
  memberImage?: string;

  @Field(() => String, { nullable: true })
  memberType?: string;
}

// ==================== EXERCISE ====================
@ObjectType()
export class Exercise {
  @Field(() => String)
  _id: ObjectId;

  @Field(() => String)
  exerciseName: string;

  @Field(() => String)
  exerciseDesc: string;

  @Field(() => String, { nullable: true })
  exerciseVideo?: string;

  @Field(() => String, { nullable: true })
  exerciseGif?: string;

  @Field(() => String, { nullable: true })
  exerciseImage?: string;

  @Field(() => String)
  primaryMuscle: string;

  @Field(() => [String])
  secondaryMuscles: string[];

  @Field(() => Int)
  sets: number;

  @Field(() => String)
  reps: string;

  @Field(() => Int)
  restTime: number;

  @Field(() => String, { nullable: true })
  tempo?: string;

  @Field(() => [String])
  instructions: string[];

  @Field(() => [String])
  tips: string[];

  @Field(() => [Equipment])
  equipment: Equipment[];

  @Field(() => ExerciseLevel)
  difficulty: ExerciseLevel;

  @Field(() => Int)
  orderInWorkout: number;

  @Field(() => String)
  workoutId: ObjectId;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}

// ==================== WORKOUT ====================
@ObjectType()
export class Workout {
  @Field(() => String)
  _id: ObjectId;

  @Field(() => String)
  workoutName: string;

  @Field(() => String, { nullable: true })
  workoutDesc?: string;

  @Field(() => Int)
  workoutDay: number;

  @Field(() => Int)
  workoutDuration: number;

  @Field(() => [BodyPart])
  bodyParts: BodyPart[];

  @Field(() => Boolean)
  isRestDay: boolean;

  @Field(() => [Exercise], { nullable: true })
  exercises?: Exercise[];

  @Field(() => String)
  programId: ObjectId;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}

// ==================== PROGRAM ====================
@ObjectType()
export class Program {
  @Field(() => String)
  _id: ObjectId;

  @Field(() => String)
  programName: string;

  @Field(() => String)
  programDesc: string;

  @Field(() => [String])
  programImages: string[];

  @Field(() => String, { nullable: true })
  programVideo?: string;

  @Field(() => ProgramType)
  programType: ProgramType;

  @Field(() => ProgramLevel)
  programLevel: ProgramLevel;

  @Field(() => ProgramStatus)
  programStatus: ProgramStatus;

  @Field(() => Int)
  programPrice: number;

  @Field(() => Int)
  programDuration: number;

  @Field(() => GraphQLISODateTime)
  programStartDate: Date;

  @Field(() => GraphQLISODateTime)
  programEndDate: Date;

  @Field(() => Int)
  programViews: number;

  @Field(() => Int)
  programLikes: number;

  @Field(() => Int)
  programMembers: number;

  @Field(() => Int)
  programComments: number;

  @Field(() => Int)
  programRank: number;

  @Field(() => [Workout], { nullable: true })
  workouts?: Workout[];

  @Field(() => [String])
  programTags: string[];

  @Field(() => [String])
  targetAudience: string[];

  @Field(() => [String])
  requirements: string[];

  @Field(() => String)
  memberId: ObjectId;

  @Field(() => MemberData, { nullable: true })
  memberData?: MemberData;

  @Field(() => Boolean, { nullable: true })
  meLiked?: boolean;

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
