import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class MemberService {
  constructor(@InjectModel('Member') private memberModel: Model<null>) {}

  public async signUp(): Promise<string> {
    return 'User signed up';
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
