import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MemberInput } from '../../libs/dto/member/member.input';
import { Member } from '../../libs/dto/member/member';
import { Message } from '../../libs/enums/common.enum';

@Injectable()
export class MemberService {
  constructor(@InjectModel('Member') private memberModel: Model<null>) {}

  public async signUp(signUpInput: MemberInput): Promise<Member> {
    try {
      const newMember = await this.memberModel.create(signUpInput);

      return newMember;
    } catch (err) {
      console.log('Error: Service signup', err.message);
      throw new BadRequestException(Message.USED_MEMBER_NICK_OR_PHONE);
    }
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
