import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TrainingProgramService } from './training-program.service';
import { Program, Programs } from '../../libs/dto/trainingProgram/program';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { MemberType } from '../../libs/enums/member.enum';
import {
  ProgramInput,
  ProgramInquiry,
} from '../../libs/dto/trainingProgram/program.input';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import type { ObjectId } from 'mongoose';
import { WithoutGuard } from '../auth/guards/without.guard';
import { shapeIntoMongoObjectId } from '../../libs/config';
import { ProgramUpdate } from '../../libs/dto/trainingProgram/program.update';
import { AuthGuard } from '../auth/guards/auth.guard';
import { ProgramEnrollment } from '../../libs/dto/programEnrollment/programEnrollment';

@Resolver()
export class TrainingProgramResolver {
  constructor(private readonly programService: TrainingProgramService) {}

  @UseGuards(RolesGuard)
  @Roles(MemberType.TRAINER)
  @Mutation(() => Program)
  public async createProgram(
    @Args('input') input: ProgramInput,
    @AuthMember('_id') memberId: ObjectId,
  ): Promise<Program> {
    console.log('Mutation createProgram');
    return await this.programService.createProgram(input, memberId);
  }

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
    @Args('programId') id: String,
    @AuthMember('_id') memberId: ObjectId,
  ): Promise<Program> {
    console.log('Query: getOneProgram');
    const programId = shapeIntoMongoObjectId(id);
    return await this.programService.getOneProgram(memberId, programId);
  }

  @UseGuards(RolesGuard)
  @Roles(MemberType.TRAINER)
  @Mutation(() => Program)
  public async updateProgram(
    @Args('input') input: ProgramUpdate,
    @Args('programId') programId: string,
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
}
