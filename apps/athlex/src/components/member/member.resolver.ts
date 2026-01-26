import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { MemberService } from './member.service';
import { Member } from '../../libs/dto/member/member';
import { LoginInput, MemberInput } from '../../libs/dto/member/member.input';

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

  public async updateMember(): Promise<string> {
    return 'User updated';
  }

  public async getMember(): Promise<string> {
    return 'User data';
  }
}
