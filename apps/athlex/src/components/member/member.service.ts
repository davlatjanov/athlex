import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LoginInput, MemberInput } from '../../libs/dto/member/member.input';
import { Member } from '../../libs/dto/member/member';
import { Message } from '../../libs/enums/common.enum';
import { MemberStatus } from '../../libs/enums/member.enum';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class MemberService {
  constructor(
    @InjectModel('Member') private memberModel: Model<Member>,
    private readonly authService: AuthService,
  ) {}

  public async signUp(signUpInput: MemberInput): Promise<Member> {
    try {
      signUpInput.memberPassword = await this.authService.hashPassword(
        signUpInput.memberPassword,
      );
      const newMember = await this.memberModel.create(signUpInput);

      newMember.accessToken =
        await this.authService.generateJwtToken(newMember);

      return newMember;
    } catch (err) {
      console.log('Error: Service signup', err.message);
      throw new BadRequestException(Message.USED_MEMBER_NICK_OR_PHONE);
    }
  }

  public async login(input: LoginInput): Promise<Member | null> {
    //@ts-ignore
    const response = await this.memberModel
      .findOne({ memberNick: input.memberNick })
      .select('+memberPassword')
      .exec();

    if (!response || response.memberStatus === MemberStatus.DELETED) {
      throw new InternalServerErrorException(Message.NO_MEMBER_NICK);
    } else if (response.memberStatus === MemberStatus.BANNED) {
      throw new InternalServerErrorException(Message.BANNED_USER);
    }

    const isMatch = await this.authService.comparePassword(
      input.memberPassword,
      response.memberPassword as string,
    );
    if (!isMatch) {
      throw new InternalServerErrorException(Message.WRONG_PASSWORD);
    }

    response.accessToken = await this.authService.generateJwtToken(response);
    return response;
  }

  public async updateMember(): Promise<string> {
    return 'User updated';
  }

  public async getMember(): Promise<string> {
    return 'User data';
  }
}
