import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import {
  LoginInput,
  MemberInput,
  TrainersInquiry,
} from '../../libs/dto/member/member.input';
import { Member, Members } from '../../libs/dto/member/member';
import { Direction, Message } from '../../libs/enums/common.enum';
import { MemberStatus, MemberType } from '../../libs/enums/member.enum';
import { AuthService } from '../auth/auth.service';
import { MemberUpdate } from '../../libs/dto/member/member.update';
import { shapeIntoMongoObjectId } from '../../libs/config';
import { T } from '../../libs/types/common';
import { ViewService } from '../view/view.service';
import { ViewGroup } from '../../libs/enums/view.enum';

@Injectable()
export class MemberService {
  constructor(
    @InjectModel('Member') private memberModel: Model<Member>,
    private readonly authService: AuthService,
    private readonly viewService: ViewService,
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

  public async updateMember(
    memberId: ObjectId,
    input: MemberUpdate | T,
  ): Promise<Member> {
    const objId = shapeIntoMongoObjectId(memberId);
    const updatedData = await this.memberModel
      .findOneAndUpdate(
        { _id: objId, memberStatus: MemberStatus.ACTIVE },
        input,
        { new: true },
      )
      .exec();
    if (!updatedData) {
      throw new InternalServerErrorException(Message.UPDATE_FAILED);
    }
    updatedData.accessToken =
      await this.authService.generateJwtToken(updatedData);
    return updatedData;
  }

  public async getMember(
    memberId: ObjectId,
    targetId: ObjectId,
  ): Promise<Member> {
    const search: T = {
      _id: targetId,
      memberStatus: {
        $in: [MemberStatus.ACTIVE, MemberStatus.BANNED],
      },
    };
    const targetMember = await this.memberModel.findOne(search).lean().exec();
    if (!targetMember) {
      throw new InternalServerErrorException(Message.NO_DATA_FOUND);
    }

    if (memberId) {
      const viewInput = {
        memberId: memberId,
        viewRefId: targetId,
        viewGroup: ViewGroup.MEMBER,
      };
      const newView = await this.viewService.recordView(viewInput);
      if (newView) {
        await this.memberModel
          .findOneAndUpdate(search, { $inc: { memberViews: 1 } }, { new: true })
          .exec();
        targetMember.memberViews = (targetMember.memberViews ?? 0) + 1;
      }
    }
    return targetMember;
  }

  public async getTrainers(
    memberId: ObjectId,
    input: TrainersInquiry,
  ): Promise<Members> {
    const match: T = {
      memberType: MemberType.TRAINER,
      memberStatus: MemberStatus.ACTIVE,
    };

    const sort: T = {
      [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC,
    };

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
}
