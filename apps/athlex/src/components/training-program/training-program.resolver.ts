import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TrainingProgramService } from './training-program.service';

import { UseGuards } from '@nestjs/common';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { MemberType } from '../../libs/enums/member.enum';

import { AuthMember } from '../auth/decorators/authMember.decorator';
import type { ObjectId } from 'mongoose';
import { WithoutGuard } from '../auth/guards/without.guard';
import { shapeIntoMongoObjectId } from '../../libs/config';
import { AuthGuard } from '../auth/guards/auth.guard';
import { ProgramEnrollment, Students } from '../../libs/dto/programEnrollment/programEnrollment';
import { Program, Programs } from '../../libs/dto/trainingProgram/program';
import {
  ProgramInput,
  ProgramInquiry,
  ProgramUpdate,
} from '../../libs/dto/trainingProgram/program.input';

@Resolver()
export class TrainingProgramResolver {
  constructor(private readonly programService: TrainingProgramService) {}

  // ==================== QUERIES ====================

  @Query(() => Programs)
  public async getPrograms(
    @Args('input') input: ProgramInquiry,
    @AuthMember('_id') memberId: ObjectId,
  ): Promise<Programs> {
    console.log('Query: getPrograms');
    return await this.programService.getPrograms(memberId, input);
  }

  @UseGuards(WithoutGuard)
  @Query(() => Program)
  public async getOneProgram(
    @Args('programId') id: string,
    @AuthMember('_id') memberId: ObjectId,
  ): Promise<Program> {
    console.log('Query: getOneProgram');
    const programId = shapeIntoMongoObjectId(id);
    return await this.programService.getOneProgram(memberId, programId);
  }
  // libs/training-program/training-program.resolver.ts

  @UseGuards(WithoutGuard)
  @Query(() => Program)
  public async getOneProgramWithMember(
    @Args('programId') id: string,
    @AuthMember('_id') memberId: ObjectId,
  ): Promise<Program> {
    console.log('Query: getOneProgramWithMember');
    const programId = shapeIntoMongoObjectId(id);
    return await this.programService.getOneProgramWithMember(
      memberId,
      programId,
    );
  }

  @UseGuards(WithoutGuard)
  @Query(() => Program)
  public async getProgramWithWorkouts(
    @Args('programId') programId: string,
    @AuthMember('_id') memberId: ObjectId,
  ): Promise<Program> {
    console.log('Query: getProgramWithWorkouts');
    return await this.programService.getProgramWithWorkouts(
      memberId,
      programId,
    );
  }

  @UseGuards(RolesGuard)
  @Roles(MemberType.TRAINER)
  @Query(() => Programs)
  public async getMyPrograms(
    @Args('input') input: ProgramInquiry,
    @AuthMember('_id') memberId: ObjectId,
  ): Promise<Programs> {
    console.log('Query: getMyPrograms');
    return await this.programService.getMyPrograms(memberId, input);
  }

  @UseGuards(AuthGuard)
  @Query(() => Programs)
  public async getJoinedPrograms(
    @Args('input') input: ProgramInquiry,
    @AuthMember('_id') memberId: ObjectId,
  ): Promise<Programs> {
    console.log('Query: getJoinedPrograms');
    return await this.programService.getJoinedPrograms(memberId, input);
  }

  // ==================== MUTATIONS ====================

  @UseGuards(RolesGuard)
  @Roles(MemberType.TRAINER)
  @Mutation(() => Program)
  public async createProgram(
    @Args('input') input: ProgramInput,
    @AuthMember('_id') memberId: ObjectId,
  ): Promise<Program> {
    console.log('Mutation: createProgram');
    return await this.programService.createProgram(memberId, input);
  }

  @UseGuards(RolesGuard)
  @Roles(MemberType.TRAINER)
  @Mutation(() => Program)
  public async updateProgram(
    @Args('programId') programId: string,
    @Args('input') input: ProgramUpdate,
    @AuthMember('_id') memberId: ObjectId,
  ): Promise<Program> {
    console.log('Mutation: updateProgram');
    return await this.programService.updateProgram(memberId, programId, input);
  }

  @UseGuards(RolesGuard)
  @Roles(MemberType.TRAINER)
  @Mutation(() => Program)
  public async deleteProgram(
    @Args('programId') programId: string,
    @AuthMember('_id') memberId: ObjectId,
  ): Promise<Program> {
    console.log('Mutation: deleteProgram');
    return await this.programService.deleteProgram(memberId, programId);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => ProgramEnrollment)
  public async joinProgram(
    @Args('programId') programId: string,
    @AuthMember('_id') memberId: ObjectId,
  ): Promise<ProgramEnrollment> {
    console.log('Mutation: joinProgram');
    return await this.programService.joinProgram(memberId, programId);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => ProgramEnrollment)
  public async leaveProgram(
    @Args('programId') programId: string,
    @AuthMember('_id') memberId: ObjectId,
  ): Promise<ProgramEnrollment> {
    console.log('Mutation: leaveProgram');
    return await this.programService.leaveProgram(memberId, programId);
  }

  @UseGuards(RolesGuard)
  @Roles(MemberType.TRAINER)
  @Query(() => Students)
  public async getMyStudents(
    @Args('page', { type: () => Number, defaultValue: 1 }) page: number,
    @Args('limit', { type: () => Number, defaultValue: 20 }) limit: number,
    @AuthMember('_id') memberId: ObjectId,
  ): Promise<Students> {
    console.log('Query: getMyStudents');
    return await this.programService.getMyStudents(memberId, page, limit);
  }
}
