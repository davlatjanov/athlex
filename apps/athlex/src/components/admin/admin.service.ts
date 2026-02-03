import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Member, Members } from '../../libs/dto/member/member';
import { MembersInquiry } from '../../libs/dto/member/member.input';
import { Direction, Message } from '../../libs/enums/common.enum';
import { T } from '../../libs/types/common';
import { MemberUpdate } from '../../libs/dto/member/member.update';

@Injectable()
export class AdminService {
  constructor(@InjectModel('Member') private memberModel: Model<Member>) {}

  public async getAllMembersByAdmin(input: MembersInquiry): Promise<Members> {
    const match: T = {};

    const sort: T = {
      [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC,
    };

    // ✅ Safe access with optional chaining
    if (input.search?.memberStatus) {
      match.memberStatus = input.search.memberStatus;
    }

    if (input.search?.memberType) {
      match.memberType = input.search.memberType;
    }

    if (input.search?.text) {
      match.memberNick = { $regex: new RegExp(input.search.text, 'i') };
    }

    console.log('match', match);

    const result = await this.memberModel
      .aggregate([
        { $match: match },
        { $sort: sort },
        {
          $facet: {
            list: [
              { $skip: (input.page - 1) * input.limit },
              { $limit: input.limit },
            ],
            metaCounter: [{ $count: 'total' }],
          },
        },
      ])
      .exec();

    if (!result.length) {
      throw new InternalServerErrorException(Message.NO_DATA_FOUND);
    }

    return result[0];
  }
  public async updateMemberByAdmin(input: MemberUpdate): Promise<Member> {
    const result = await this.memberModel
      .findOneAndUpdate({ _id: input._id }, input, { new: true })
      .exec();

    if (!result) throw new InternalServerErrorException(Message.UPDATE_FAILED);
    return result;
  }
}
