// libs/training-program/exercise.resolver.ts

import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { ExerciseService } from './exercise.service';

import { UseGuards } from '@nestjs/common';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { MemberType } from '../../libs/enums/member.enum';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import type { ObjectId } from 'mongoose';
import { Exercise } from '../../libs/dto/trainingProgram/program';
import { ExerciseInput } from '../../libs/dto/trainingProgram/program.input';

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
}
