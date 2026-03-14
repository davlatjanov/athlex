// libs/training-program/exercise.resolver.ts

import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ExerciseService } from './exercise.service';

import { UseGuards } from '@nestjs/common';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { MemberType } from '../../libs/enums/member.enum';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import type { ObjectId } from 'mongoose';
import { Exercise } from '../../libs/dto/trainingProgram/program';
import {
  ExerciseInput,
  ExerciseUpdate,
} from '../../libs/dto/trainingProgram/program.input';

@Resolver()
export class ExerciseResolver {
  constructor(private readonly exerciseService: ExerciseService) {}

  @UseGuards(RolesGuard)
  @Roles(MemberType.TRAINER)
  @Mutation(() => Exercise)
  public async createExercise(
    @Args('input') input: ExerciseInput,
    @AuthMember('_id') memberId: ObjectId,
  ): Promise<Exercise> {
    console.log('Mutation: createExercise');
    return await this.exerciseService.createExercise(memberId, input);
  }

  @Query(() => [Exercise])
  public async getExercisesByWorkout(
    @Args('workoutId') workoutId: string,
  ): Promise<Exercise[]> {
    console.log('Query: getExercisesByWorkout');
    return await this.exerciseService.getExercisesByWorkout(workoutId);
  }

  @UseGuards(RolesGuard)
  @Roles(MemberType.TRAINER)
  @Mutation(() => Exercise)
  public async updateExercise(
    @Args('exerciseId') exerciseId: string,
    @Args('input') input: ExerciseUpdate,
    @AuthMember('_id') memberId: ObjectId,
  ): Promise<Exercise> {
    console.log('Mutation: updateExercise');
    return await this.exerciseService.updateExercise(
      memberId,
      exerciseId,
      input,
    );
  }

  @UseGuards(RolesGuard)
  @Roles(MemberType.TRAINER)
  @Mutation(() => Exercise)
  public async deleteExercise(
    @Args('exerciseId') exerciseId: string,
    @AuthMember('_id') memberId: ObjectId,
  ): Promise<Exercise> {
    console.log('Mutation: deleteExercise');
    return await this.exerciseService.deleteExercise(memberId, exerciseId);
  }
}
