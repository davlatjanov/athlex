import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Member } from '../../libs/dto/member/member';

@Injectable()
export class AdminService {
  constructor(@InjectModel('Member') private memberModel: Model<Member>) {}

  public async getAllMembersByAdmin(): Promise<string> {
    return 'getAllMembersByAdmin executed';
  }

  public async updateMemberByAdmin(): Promise<string> {
    return 'updateMemberByAdmin executed';
  }
}
