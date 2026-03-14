import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AdminService } from './admin.service';
import { Member, Members } from '../../libs/dto/member/member';
import { Roles } from '../auth/decorators/roles.decorator';
import { MemberType } from '../../libs/enums/member.enum';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from '../auth/guards/roles.guard';
import { MembersInquiry } from '../../libs/dto/member/member.input';
import { MemberUpdate } from '../../libs/dto/member/member.update';
import { Programs } from '../../libs/dto/trainingProgram/program';
import { ProgramInquiry } from '../../libs/dto/trainingProgram/program.input';
import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class DashboardStats {
  @Field(() => Int)
  totalMembers: number;

  @Field(() => Int)
  activeMembers: number;

  @Field(() => Int)
  totalPrograms: number;

  @Field(() => Int)
  activePrograms: number;

  @Field(() => Int)
  totalProducts: number;

  @Field(() => Int)
  totalTrainers: number;

  @Field(() => Int)
  newMembersLast30Days: number;
}

@Resolver()
export class AdminResolver {
  constructor(private readonly adminService: AdminService) {}

  @Roles(MemberType.ADMIN)
  @UseGuards(RolesGuard)
  @Query(() => Members)
  public async getAllMembersByAdmin(
    @Args('input') input: MembersInquiry,
  ): Promise<Members> {
    console.log('Query: getAllMembersByAdmin');
    return await this.adminService.getAllMembersByAdmin(input);
  }

  @Roles(MemberType.ADMIN)
  @UseGuards(RolesGuard)
  @Mutation(() => Member)
  public async updateMemberByAdmin(
    @Args('input') input: MemberUpdate,
  ): Promise<Member> {
    console.log('Mutation: updateMemberByAdmin');
    return await this.adminService.updateMemberByAdmin(input);
  }

  @Roles(MemberType.ADMIN)
  @UseGuards(RolesGuard)
  @Query(() => Programs)
  public async getAllProgramsByAdmin(
    @Args('input') input: ProgramInquiry,
  ): Promise<Programs> {
    console.log('Query: getAllProgramsByAdmin');
    return await this.adminService.getAllProgramsByAdmin(input);
  }

  @Roles(MemberType.ADMIN)
  @UseGuards(RolesGuard)
  @Query(() => DashboardStats)
  public async getDashboardStats(): Promise<DashboardStats> {
    console.log('Query: getDashboardStats');
    return await this.adminService.getDashboardStats();
  }
}
