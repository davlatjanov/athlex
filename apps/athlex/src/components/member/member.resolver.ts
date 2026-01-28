import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { MemberService } from './member.service';
import { Member, Members } from '../../libs/dto/member/member';
import {
  LoginInput,
  MemberInput,
  TrainersInquiry,
} from '../../libs/dto/member/member.input';
import { AuthGuard } from '../auth/guards/auth.guard';
import { UseGuards } from '@nestjs/common';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import type { ObjectId } from 'mongoose';
import type { T } from '../../libs/types/common';
import { MemberUpdate } from '../../libs/dto/member/member.update';
import { WithoutGuard } from '../auth/guards/without.guard';
import { shapeIntoMongoObjectId } from '../../libs/config';

@Resolver()
export class MemberResolver {
  constructor(private readonly memberService: MemberService) {}

  @Mutation(() => Member)
  public async signUp(
    @Args('input') signUpInput: MemberInput,
  ): Promise<Member> {
    console.log('Mutation signUp');
    return await this.memberService.signUp(signUpInput);
  }

  @Mutation(() => Member)
  public async login(@Args('input') input: LoginInput): Promise<Member | null> {
    console.log('Mutation login');
    return await this.memberService.login(input);
  }

  @UseGuards(AuthGuard)
  @Query(() => String)
  public async checkAuth(@AuthMember() member: T): Promise<string> {
    console.log('Query checkAuth');
    console.log(
      `Hello ${member.memberNick}  your ID => ${member._id} and you are ${member.memberType}`,
    );
    return `Hello ${member.memberNick}  your ID => ${member._id} and you are ${member.memberType}`;
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Member)
  public async updateMember(
    @Args('input') input: MemberUpdate,
    @AuthMember('_id') memberId: ObjectId,
  ): Promise<Member> {
    console.log('Mutation updateMember');
    delete input._id;
    return await this.memberService.updateMember(memberId, input);
  }

  @UseGuards(WithoutGuard)
  @Query(() => Member)
  public async getMember(
    @Args('memberId') input: string,
    @AuthMember('_id') memberId: ObjectId,
  ): Promise<Member> {
    console.log('Query getMember');
    const targetId = shapeIntoMongoObjectId(input);
    return this.memberService.getMember(memberId, targetId);
  }

  @UseGuards(WithoutGuard)
  @Query(() => Members)
  public async getTrainers(
    @Args('input') input: TrainersInquiry,
    @AuthMember('_id') memberId: ObjectId,
  ): Promise<Members> {
    console.log('Query getAgents');
    return this.memberService.getTrainers(memberId, input);
  }
}
