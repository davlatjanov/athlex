import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { MemberService } from './member.service';
import { Member } from '../../libs/dto/member/member';
import { MemberInput } from '../../libs/dto/member/member.input';

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
  public async login(): Promise<string> {
    return 'User logged in';
  }

  public async updateMember(): Promise<string> {
    return 'User updated';
  }

  public async getMember(): Promise<string> {
    return 'User data';
  }
}
