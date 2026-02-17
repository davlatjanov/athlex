// libs/training-program/workout.resolver.ts

import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { WorkoutService } from './workout.service';

import { UseGuards } from '@nestjs/common';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { MemberType } from '../../libs/enums/member.enum';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import type { ObjectId } from 'mongoose';
import { Workout } from '../../libs/dto/trainingProgram/program';
import { WorkoutInput } from '../../libs/dto/trainingProgram/program.input';

@Resolver()
export class WorkoutResolver {
  constructor(private readonly workoutService: WorkoutService) {}

  @UseGuards(RolesGuard)
  @Roles(MemberType.TRAINER)
  @Mutation(() => Workout)
  public async createWorkout(
    @Args('input') input: WorkoutInput,
    @AuthMember('_id') memberId: ObjectId,
  ): Promise<Workout> {
    console.log('Mutation: createWorkout');
    return await this.workoutService.createWorkout(memberId, input);
  }

  @Query(() => [Workout])
  public async getWorkoutsByProgram(
    @Args('programId') programId: string,
  ): Promise<Workout[]> {
    console.log('Query: getWorkoutsByProgram');
    return await this.workoutService.getWorkoutsByProgram(programId);
  }
}
