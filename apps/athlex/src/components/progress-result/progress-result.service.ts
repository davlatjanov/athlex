import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Direction, Message } from '../../libs/enums/common.enum';
import { shapeIntoMongoObjectId } from '../../libs/config';
import { T } from '../../libs/types/common';
import {
  ProgressResultInput,
  ProgressResultInquiry,
  ProgressResultUpdate,
} from '../../libs/dto/progress-result.ts/progress-result.input';
import {
  ProgressResult,
  ProgressResults,
} from '../../libs/dto/progress-result.ts/progress-result';
import { ProgressResultStatus } from '../../libs/enums/progress-result.enum';

@Injectable()
export class ProgressResultService {
  constructor(
    @InjectModel('ProgressResult')
    private progressResultModel: Model<ProgressResult>,
  ) {}

  public async createProgressResult(
    memberId: ObjectId,
    input: ProgressResultInput,
  ): Promise<ProgressResult> {
    const programId = input.programId ? shapeIntoMongoObjectId(input.programId) : undefined;
    const trainerId = input.trainerId ? shapeIntoMongoObjectId(input.trainerId) : undefined;

    const newProgressResult = await this.progressResultModel.create({
      ...input,
      ...(programId && { programId }),
      ...(trainerId && { trainerId }),
      memberId,
    });

    if (!newProgressResult) {
      throw new InternalServerErrorException(Message.CREATE_FAILED);
    }

    return newProgressResult;
  }

  public async updateProgressResult(
    memberId: ObjectId,
    input: ProgressResultUpdate,
  ): Promise<ProgressResult> {
    const { _id, ...updateData } = input;
    const progressResultId = shapeIntoMongoObjectId(_id);

    // Verify ownership
    const progressResult = await this.progressResultModel
      .findOne({ _id: progressResultId, memberId })
      .exec();

    if (!progressResult) {
      throw new InternalServerErrorException(Message.UPDATE_FAILED);
    }

    const result = await this.progressResultModel
      .findByIdAndUpdate(progressResultId, updateData, { new: true })
      .exec();

    if (!result) {
      throw new InternalServerErrorException(Message.UPDATE_FAILED);
    }

    return result;
  }

  public async deleteProgressResult(
    memberId: ObjectId,
    progressResultId: ObjectId,
  ): Promise<ProgressResult> {
    // Verify ownership
    const progressResult = await this.progressResultModel
      .findOne({ _id: progressResultId, memberId })
      .exec();

    if (!progressResult) {
      throw new InternalServerErrorException(Message.DELETE_FAILED);
    }

    const result = await this.progressResultModel
      .findByIdAndDelete(progressResultId)
      .exec();

    if (!result) {
      throw new InternalServerErrorException(Message.DELETE_FAILED);
    }

    return result;
  }

  public async getProgressResults(
    input: ProgressResultInquiry,
  ): Promise<ProgressResults> {
    const {
      page,
      limit,
      sort,
      direction,
      programId,
      memberId,
      trainerId,
      status,
    } = input;
    const match: T = { status: status ?? ProgressResultStatus.ACTIVE };

    if (programId) {
      match.programId = shapeIntoMongoObjectId(programId);
    }

    if (memberId) {
      match.memberId = shapeIntoMongoObjectId(memberId);
    }

    if (trainerId) {
      match.trainerId = shapeIntoMongoObjectId(trainerId);
    }

    const sortOption: T = {
      [sort ?? 'createdAt']: direction ?? Direction.DESC,
    };

    const result = await this.progressResultModel
      .aggregate([
        { $match: match },
        { $sort: sortOption },
        {
          $lookup: {
            from: 'members',
            localField: 'memberId',
            foreignField: '_id',
            as: 'memberData',
          },
        },
        {
          $lookup: {
            from: 'members',
            localField: 'trainerId',
            foreignField: '_id',
            as: 'trainerData',
          },
        },
        { $unwind: { path: '$memberData', preserveNullAndEmptyArrays: true } },
        { $unwind: { path: '$trainerData', preserveNullAndEmptyArrays: true } },
        {
          $facet: {
            list: [{ $skip: (page - 1) * limit }, { $limit: limit }],
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

  public async getMyProgressResults(
    memberId: ObjectId,
    input: ProgressResultInquiry,
  ): Promise<ProgressResults> {
    const { page, limit, sort, direction } = input;
    const match: T = { memberId };

    const sortOption: T = {
      [sort ?? 'createdAt']: direction ?? Direction.DESC,
    };

    const result = await this.progressResultModel
      .aggregate([
        { $match: match },
        { $sort: sortOption },
        {
          $lookup: {
            from: 'members',
            localField: 'trainerId',
            foreignField: '_id',
            as: 'trainerData',
          },
        },
        { $unwind: { path: '$trainerData', preserveNullAndEmptyArrays: true } },
        {
          $facet: {
            list: [{ $skip: (page - 1) * limit }, { $limit: limit }],
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

  // Admin methods
  public async updateProgressResultByAdmin(
    input: ProgressResultUpdate,
  ): Promise<ProgressResult> {
    const { _id, ...updateData } = input;
    const progressResultId = shapeIntoMongoObjectId(_id);

    const result = await this.progressResultModel
      .findByIdAndUpdate(progressResultId, updateData, { new: true })
      .exec();

    if (!result) {
      throw new InternalServerErrorException(Message.UPDATE_FAILED);
    }

    return result;
  }

  public async deleteProgressResultByAdmin(
    progressResultId: ObjectId,
  ): Promise<ProgressResult> {
    const result = await this.progressResultModel
      .findByIdAndDelete(progressResultId)
      .exec();

    if (!result) {
      throw new InternalServerErrorException(Message.DELETE_FAILED);
    }

    return result;
  }
}
