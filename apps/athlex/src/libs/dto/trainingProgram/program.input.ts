// libs/training-program/training-program.input.ts
import { Field, InputType, Int } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsNumber,
  IsEnum,
  IsString,
  Min,
} from 'class-validator';
import {
  ProgramLevel,
  ProgramStatus,
  ProgramType,
} from '../../enums/training-program.enum';
import { BodyPart } from '../../enums/workout.enum';
import { Equipment, ExerciseLevel } from '../../enums/exercise.enum';
import { Direction } from '../../enums/common.enum';

// ==================== PROGRAM INPUT ====================
@InputType()
export class ProgramInput {
  @IsNotEmpty()
  @Field(() => String)
  programName: string;

  @IsNotEmpty()
  @Field(() => String)
  programDesc: string;

  @IsOptional()
  @IsArray()
  @Field(() => [String], { nullable: true })
  programImages: string[];

  @IsOptional()
  @Field(() => String, { nullable: true })
  programVideo?: string;

  @IsNotEmpty()
  @IsEnum(ProgramType)
  @Field(() => ProgramType)
  programType: ProgramType;

  @IsNotEmpty()
  @IsEnum(ProgramLevel)
  @Field(() => ProgramLevel)
  programLevel: ProgramLevel;

  @IsOptional()
  @IsEnum(ProgramStatus)
  @Field(() => ProgramStatus, { nullable: true })
  programStatus?: ProgramStatus;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Field(() => Int)
  programPrice: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Field(() => Int)
  programDuration: number;

  @IsNotEmpty()
  @Field(() => Date)
  programStartDate: Date;

  @IsNotEmpty()
  @Field(() => Date)
  programEndDate: Date;

  @IsOptional()
  @IsArray()
  @Field(() => [String], { nullable: true })
  programTags?: string[];

  @IsOptional()
  @IsArray()
  @Field(() => [String], { nullable: true })
  targetAudience?: string[];

  @IsOptional()
  @IsArray()
  @Field(() => [String], { nullable: true })
  requirements?: string[];
}

// ==================== PROGRAM INQUIRY ====================
@InputType()
export class ProgramInquiry {
  @IsOptional()
  @Field(() => Int, { nullable: true })
  page?: number;

  @IsOptional()
  @Field(() => Int, { nullable: true })
  limit?: number;

  @IsOptional()
  @Field(() => String, { nullable: true })
  search?: string;

  @IsOptional()
  @IsEnum(ProgramType)
  @Field(() => ProgramType, { nullable: true })
  programType?: ProgramType;

  @IsOptional()
  @IsEnum(ProgramLevel)
  @Field(() => ProgramLevel, { nullable: true })
  programLevel?: ProgramLevel;

  @IsOptional()
  @IsEnum(ProgramStatus)
  @Field(() => ProgramStatus, { nullable: true })
  programStatus?: ProgramStatus;

  @IsOptional()
  @Field(() => String, { nullable: true })
  sort?: string;

  @IsOptional()
  @IsEnum(Direction)
  @Field(() => Direction, { nullable: true })
  direction?: Direction;
}

// ==================== WORKOUT INPUT ====================
@InputType()
export class WorkoutInput {
  @IsNotEmpty()
  @Field(() => String)
  workoutName: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  workoutDesc?: string;

  @IsNotEmpty()
  @IsNumber()
  @Field(() => Int)
  workoutDay: number;

  @IsOptional()
  @IsNumber()
  @Field(() => Int, { nullable: true })
  workoutDuration?: number;

  @IsNotEmpty()
  @IsArray()
  @Field(() => [BodyPart])
  bodyParts: BodyPart[];

  @IsOptional()
  @Field(() => Boolean, { nullable: true })
  isRestDay?: boolean;

  @IsNotEmpty()
  @Field(() => String)
  programId: string;
}

// ==================== EXERCISE INPUT ====================
@InputType()
export class ExerciseInput {
  @IsNotEmpty()
  @Field(() => String)
  exerciseName: string;

  @IsNotEmpty()
  @Field(() => String)
  exerciseDesc: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  exerciseVideo?: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  exerciseGif?: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  exerciseImage?: string;

  @IsNotEmpty()
  @Field(() => String)
  primaryMuscle: string;

  @IsOptional()
  @IsArray()
  @Field(() => [String], { nullable: true })
  secondaryMuscles?: string[];

  @IsOptional()
  @IsNumber()
  @Field(() => Int, { nullable: true })
  sets?: number;

  @IsOptional()
  @Field(() => String, { nullable: true })
  reps?: string;

  @IsOptional()
  @IsNumber()
  @Field(() => Int, { nullable: true })
  restTime?: number;

  @IsOptional()
  @Field(() => String, { nullable: true })
  tempo?: string;

  @IsNotEmpty()
  @IsArray()
  @Field(() => [String])
  instructions: string[];

  @IsOptional()
  @IsArray()
  @Field(() => [String], { nullable: true })
  tips?: string[];

  @IsNotEmpty()
  @IsArray()
  @Field(() => [Equipment])
  equipment: Equipment[];

  @IsOptional()
  @IsEnum(ExerciseLevel)
  @Field(() => ExerciseLevel, { nullable: true })
  difficulty?: ExerciseLevel;

  @IsOptional()
  @IsNumber()
  @Field(() => Int, { nullable: true })
  orderInWorkout?: number;

  @IsNotEmpty()
  @Field(() => String)
  workoutId: string;
}
// ==================== PROGRAM UPDATE ====================
@InputType()
export class ProgramUpdate {
  @IsOptional()
  @Field(() => String, { nullable: true })
  programName?: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  programDesc?: string;

  @IsOptional()
  @IsArray()
  @Field(() => [String], { nullable: true })
  programImages?: string[];

  @IsOptional()
  @Field(() => String, { nullable: true })
  programVideo?: string;

  @IsOptional()
  @IsEnum(ProgramType)
  @Field(() => ProgramType, { nullable: true })
  programType?: ProgramType;

  @IsOptional()
  @IsEnum(ProgramLevel)
  @Field(() => ProgramLevel, { nullable: true })
  programLevel?: ProgramLevel;

  @IsOptional()
  @IsEnum(ProgramStatus)
  @Field(() => ProgramStatus, { nullable: true })
  programStatus?: ProgramStatus;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Field(() => Int, { nullable: true })
  programPrice?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Field(() => Int, { nullable: true })
  programDuration?: number;

  @IsOptional()
  @Field(() => Date, { nullable: true })
  programStartDate?: Date;

  @IsOptional()
  @Field(() => Date, { nullable: true })
  programEndDate?: Date;

  @IsOptional()
  @IsArray()
  @Field(() => [String], { nullable: true })
  programTags?: string[];

  @IsOptional()
  @IsArray()
  @Field(() => [String], { nullable: true })
  targetAudience?: string[];

  @IsOptional()
  @IsArray()
  @Field(() => [String], { nullable: true })
  requirements?: string[];
}
