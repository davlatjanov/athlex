import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { AuthService } from '../auth/auth.service';
import { ViewService } from '../view/view.service';

import { T } from '../../libs/types/common';
import { Direction, Message } from '../../libs/enums/common.enum';
import { MemberService } from '../member/member.service';
import { ViewGroup } from '../../libs/enums/view.enum';
import { ViewInput } from '../../libs/dto/view/view.input';
import { ProgramEnrollment } from '../../libs/dto/programEnrollment/programEnrollment';
import { ProgramStatus } from '../../libs/enums/training-program.enum';
import { Program, Programs } from '../../libs/dto/trainingProgram/program';
import {
  ProgramInput,
  ProgramInquiry,
  ProgramUpdate,
} from '../../libs/dto/trainingProgram/program.input';

@Injectable()
export class TrainingProgramService {
  constructor(
    @InjectModel('ProgramEnrollment')
    private programEnrollmentModel: Model<ProgramEnrollment>,
    @InjectModel('Program') private programModel: Model<Program>,
    private readonly authService: AuthService,
    private readonly viewService: ViewService,
    private readonly memberService: MemberService,
  ) {}

  // ==================== CREATE PROGRAM ====================
  public async createProgram(
    memberId: ObjectId,
    input: ProgramInput,
  ): Promise<Program> {
    const programObject = {
      ...input,
      programStartDate: new Date(input.programStartDate),
      programEndDate: new Date(input.programEndDate),
      memberId,
      programStatus: input.programStatus || ProgramStatus.ACTIVE,
      programRank: 0,
      programViews: 0,
      programLikes: 0,
      programMembers: 0,
      programComments: 0,
    };

    const newProgram = await this.programModel.create(programObject);

    if (!newProgram) {
      throw new InternalServerErrorException(Message.CREATE_FAILED);
    }

    await this.memberService.updateMember(memberId, {
      $inc: { memberPrograms: 1 },
    });

    return newProgram;
  }

  // ==================== GET PROGRAMS (WITH FILTERS) ====================
  public async getPrograms(
    memberId: ObjectId,
    input: ProgramInquiry,
  ): Promise<Programs> {
    const match: T = {
      programStatus: ProgramStatus.ACTIVE, // Only show active programs
    };

    const sort: T = {
      [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC,
    };

    // Search by text
    if (input.search) {
      match.$text = { $search: input.search };
    }

    // Filter by program type
    if (input.programType) {
      match.programType = input.programType;
    }

    // Filter by program level
    if (input.programLevel) {
      match.programLevel = input.programLevel;
    }

    // Filter by status (for admin/trainer)
    if (input.programStatus) {
      match.programStatus = input.programStatus;
    }

    console.log('match', match);

    const result = await this.programModel
      .aggregate([
        { $match: match },
        { $sort: sort },
        {
          $lookup: {
            from: 'members',
            localField: 'memberId',
            foreignField: '_id',
            as: 'memberData',
          },
        },
        {
          $unwind: {
            path: '$memberData',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $facet: {
            list: [
              { $skip: ((input.page || 1) - 1) * (input.limit || 12) },
              { $limit: input.limit || 12 },
            ],
            metaCounter: [{ $count: 'total' }],
          },
        },
      ])
      .exec();

    if (!result.length)
      throw new InternalServerErrorException(Message.NO_DATA_FOUND);

    return result[0];
  }

  // ==================== GET ONE PROGRAM ====================
  // libs/training-program/training-program.service.ts

  public async getOneProgram(
    memberId: ObjectId,
    programId: ObjectId,
  ): Promise<Program> {
    let result = await this.programModel.findOne({ _id: programId }).exec(); // ← REMOVED .populate()

    if (!result) {
      throw new InternalServerErrorException(Message.NO_DATA_FOUND);
    }

    // Record view if user is logged in
    if (memberId) {
      const viewInput: ViewInput = {
        viewGroup: ViewGroup.PROGRAM,
        viewRefId: programId,
        memberId: memberId,
      };
      const newView = await this.viewService.recordView(viewInput);
      if (newView) {
        result = await this.programModel.findOneAndUpdate(
          { _id: programId },
          { $inc: { programViews: 1 } },
          { new: true },
        );
        if (!result) {
          throw new InternalServerErrorException(Message.NO_DATA_FOUND);
        }
      }
    }

    return result;
  }

  // libs/training-program/training-program.service.ts

  public async getOneProgramWithMember(
    memberId: ObjectId,
    programId: ObjectId,
  ): Promise<Program> {
    const result = await this.programModel
      .findOne({ _id: programId })
      .lean()
      .exec();

    if (!result) {
      throw new InternalServerErrorException(Message.NO_DATA_FOUND);
    }

    // Manually fetch member data
    const memberData = await this.memberService.getMember(
      null,
      result.memberId,
    );

    // Record view if user is logged in
    if (memberId) {
      const viewInput: ViewInput = {
        viewGroup: ViewGroup.PROGRAM,
        viewRefId: programId,
        memberId: memberId,
      };
      const newView = await this.viewService.recordView(viewInput);
      if (newView) {
        await this.programModel.findOneAndUpdate(
          { _id: programId },
          { $inc: { programViews: 1 } },
        );
      }
    }

    return {
      ...result,
      memberData: {
        _id: memberData._id,
        memberNick: memberData.memberNick,
        memberImage: memberData.memberImage,
        memberType: memberData.memberType,
      },
    } as Program;
  }
  // ==================== GET PROGRAM WITH WORKOUTS ====================
  public async getProgramWithWorkouts(
    memberId: ObjectId,
    programId: string,
  ): Promise<Program> {
    const result = await this.programModel
      .findById(programId)
      .populate({
        path: 'workouts',
        populate: {
          path: 'exercises',
          options: { sort: { orderInWorkout: 1 } },
        },
      })
      .lean()
      .exec();

    if (!result) {
      throw new InternalServerErrorException(Message.NO_DATA_FOUND);
    }

    return result;
  }

  // ==================== UPDATE PROGRAM ====================
  public async updateProgram(
    memberId: ObjectId,
    programId: string,
    input: ProgramUpdate,
  ): Promise<Program> {
    const program = await this.programModel
      .findOne({ _id: programId, memberId: memberId })
      .exec();

    if (!program) {
      throw new InternalServerErrorException(Message.UPDATE_FAILED);
    }

    // Convert date strings to Date objects if provided
    const updateData: any = { ...input };
    if (input.programStartDate) {
      updateData.programStartDate = new Date(input.programStartDate);
    }
    if (input.programEndDate) {
      updateData.programEndDate = new Date(input.programEndDate);
    }

    const result = await this.programModel
      .findByIdAndUpdate(programId, updateData, { new: true })
      .exec();

    if (!result) {
      throw new InternalServerErrorException(Message.UPDATE_FAILED);
    }

    return result;
  }

  // ==================== DELETE PROGRAM ====================
  public async deleteProgram(
    memberId: ObjectId,
    programId: string,
  ): Promise<Program> {
    const program = await this.programModel
      .findOne({ _id: programId, memberId: memberId })
      .exec();

    if (!program) {
      throw new InternalServerErrorException(Message.DELETE_FAILED);
    }

    // Soft delete - change status to ARCHIVED
    const result = await this.programModel
      .findByIdAndUpdate(
        programId,
        { programStatus: ProgramStatus.ARCHIVED },
        { new: true },
      )
      .exec();

    if (!result) {
      throw new InternalServerErrorException(Message.DELETE_FAILED);
    }

    // Decrement member's program count
    await this.memberService.updateMember(memberId, {
      $inc: { memberPrograms: -1 },
    });

    return result;
  }

  // ==================== GET MY PROGRAMS (TRAINER) ====================
  public async getMyPrograms(
    memberId: ObjectId,
    input: ProgramInquiry,
  ): Promise<Programs> {
    const match: T = { memberId: memberId };
    const sort: T = {
      [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC,
    };

    // Filter by status if provided
    if (input.programStatus) {
      match.programStatus = input.programStatus;
    }

    // Search by text
    if (input.search) {
      match.$text = { $search: input.search };
    }

    const result = await this.programModel
      .aggregate([
        { $match: match },
        { $sort: sort },
        {
          $facet: {
            list: [
              { $skip: ((input.page || 1) - 1) * (input.limit || 12) },
              { $limit: input.limit || 12 },
            ],
            metaCounter: [{ $count: 'total' }],
          },
        },
      ])
      .exec();

    if (!result.length)
      throw new InternalServerErrorException(Message.NO_DATA_FOUND);

    return result[0];
  }

  // ==================== GET JOINED PROGRAMS (USER) ====================
  public async getJoinedPrograms(
    memberId: ObjectId,
    input: ProgramInquiry,
  ): Promise<Programs> {
    const sort: T = {
      [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC,
    };

    const result = await this.programEnrollmentModel
      .aggregate([
        { $match: { memberId } },
        {
          $lookup: {
            from: 'programs',
            localField: 'programId',
            foreignField: '_id',
            as: 'programData',
          },
        },
        { $unwind: '$programData' },
        {
          $lookup: {
            from: 'members',
            localField: 'programData.memberId',
            foreignField: '_id',
            as: 'programData.memberData',
          },
        },
        {
          $unwind: {
            path: '$programData.memberData',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $replaceRoot: { newRoot: '$programData' },
        },
        { $sort: sort },
        {
          $facet: {
            list: [
              { $skip: ((input.page || 1) - 1) * (input.limit || 12) },
              { $limit: input.limit || 12 },
            ],
            metaCounter: [{ $count: 'total' }],
          },
        },
      ])
      .exec();

    if (!result.length)
      throw new InternalServerErrorException(Message.NO_DATA_FOUND);

    return result[0];
  }

  // ==================== JOIN PROGRAM ====================
  public async joinProgram(
    memberId: ObjectId,
    programId: string,
  ): Promise<ProgramEnrollment> {
    const program = await this.programModel.findById(programId).exec();
    if (!program) {
      throw new InternalServerErrorException(Message.NO_DATA_FOUND);
    }

    const existingEnrollment = await this.programEnrollmentModel
      .findOne({ memberId, programId })
      .exec();

    if (existingEnrollment) {
      throw new InternalServerErrorException(Message.ALREADY_JOINED);
    }

    const enrollment = await this.programEnrollmentModel.create({
      memberId,
      programId,
    });

    if (!enrollment) {
      throw new InternalServerErrorException(Message.CREATE_FAILED);
    }

    await this.programModel.findByIdAndUpdate(programId, {
      $inc: { programMembers: 1 },
    });

    return enrollment;
  }

  // ==================== LEAVE PROGRAM ====================
  public async leaveProgram(
    memberId: ObjectId,
    programId: string,
  ): Promise<ProgramEnrollment> {
    const enrollment = await this.programEnrollmentModel
      .findOne({ memberId, programId })
      .exec();

    if (!enrollment) {
      throw new InternalServerErrorException('Not enrolled in this program');
    }

    const result = await this.programEnrollmentModel
      .findByIdAndDelete(enrollment._id)
      .exec();

    if (!result) {
      throw new InternalServerErrorException(Message.DELETE_FAILED);
    }

    await this.programModel.findByIdAndUpdate(programId, {
      $inc: { programMembers: -1 },
    });

    return result;
  }

  // ==================== UPDATE BY LIKE ====================
  public async updateProgramByLike(
    programId: ObjectId,
    increment: number,
  ): Promise<void> {
    await this.programModel
      .findByIdAndUpdate(programId, {
        $inc: { programLikes: increment },
      })
      .exec();
  }

  // ==================== GET PROGRAM BY ID ====================
  public async getProgramById(programId: ObjectId): Promise<Program> {
    const program = await this.programModel.findById(programId).exec();
    if (!program) {
      throw new InternalServerErrorException(Message.NO_DATA_FOUND);
    }
    return program;
  }
}
