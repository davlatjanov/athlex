import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { MemberService } from './member.service';
import { Member } from '../../libs/dto/member/member';
import { LoginInput, MemberInput } from '../../libs/dto/member/member.input';
import { AuthGuard } from '../auth/guards/auth.guard';
import { UseGuards } from '@nestjs/common';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import type { ObjectId } from 'mongoose';
import type { T } from '../../libs/types/common';

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
  @Mutation(() => String)
  public async updateMember(
    @AuthMember('_id') memberId: ObjectId,
  ): Promise<string> {
    console.log('Mutation updateMember');
    console.log('authMember in updateMember:', memberId);
    return await this.memberService.updateMember();
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

  public async getMember(): Promise<string> {
    return 'User data';
  }
}
