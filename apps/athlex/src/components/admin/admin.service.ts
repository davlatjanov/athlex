import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Member, Members } from '../../libs/dto/member/member';
import { DashboardStats } from './admin.resolver';
import { MembersInquiry } from '../../libs/dto/member/member.input';
import { Direction, Message } from '../../libs/enums/common.enum';
import { T } from '../../libs/types/common';
import { MemberUpdate } from '../../libs/dto/member/member.update';
import { Programs } from '../../libs/dto/trainingProgram/program';
import { ProgramInquiry } from '../../libs/dto/trainingProgram/program.input';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel('Member') private memberModel: Model<Member>,
    @InjectModel('Program') private programModel: Model<any>,
    @InjectModel('Product') private productModel: Model<any>,
  ) {}

  public async getAllMembersByAdmin(input: MembersInquiry): Promise<Members> {
    const match: T = {};

    const sort: T = {
      [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC,
    };

    if (input.search?.memberStatus) {
      match.memberStatus = input.search.memberStatus;
    }

    if (input.search?.memberType) {
      match.memberType = input.search.memberType;
    }

    if (input.search?.text) {
      match.memberNick = { $regex: new RegExp(input.search.text, 'i') };
    }

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

  public async getAllProgramsByAdmin(input: ProgramInquiry): Promise<Programs> {
    const match: T = {};

    const sort: T = {
      [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC,
    };

    if (input.programType) match.programType = input.programType;
    if (input.programLevel) match.programLevel = input.programLevel;
    if (input.programStatus) match.programStatus = input.programStatus;

    if (input.search) {
      match.$or = [
        { programName: { $regex: new RegExp(input.search, 'i') } },
        { programDesc: { $regex: new RegExp(input.search, 'i') } },
      ];
    }

    const result = await this.programModel
      .aggregate([
        { $match: match },
        { $sort: sort },
        {
          $facet: {
            list: [
              { $skip: ((input.page ?? 1) - 1) * (input.limit ?? 10) },
              { $limit: input.limit ?? 10 },
              {
                $lookup: {
                  from: 'members',
                  localField: 'memberId',
                  foreignField: '_id',
                  as: 'memberData',
                },
              },
              { $unwind: { path: '$memberData', preserveNullAndEmptyArrays: true } },
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

  public async getDashboardStats(): Promise<DashboardStats> {
    const [
      totalMembers,
      activeMembers,
      totalPrograms,
      activePrograms,
      totalProducts,
      totalTrainers,
    ] = await Promise.all([
      this.memberModel.countDocuments().exec(),
      this.memberModel.countDocuments({ memberStatus: 'ACTIVE' }).exec(),
      this.programModel.countDocuments().exec(),
      this.programModel.countDocuments({ programStatus: 'ACTIVE' }).exec(),
      this.productModel.countDocuments().exec(),
      this.memberModel.countDocuments({ memberType: 'TRAINER' }).exec(),
    ]);

    // New members in last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const newMembersLast30Days = await this.memberModel
      .countDocuments({ createdAt: { $gte: thirtyDaysAgo } })
      .exec();

    return {
      totalMembers,
      activeMembers,
      totalPrograms,
      activePrograms,
      totalProducts,
      totalTrainers,
      newMembersLast30Days,
    };
  }
}
