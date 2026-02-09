import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { AuthService } from '../auth/auth.service';
import { ViewService } from '../view/view.service';
import { Program, Programs } from '../../libs/dto/trainingProgram/program';
import {
  ProgramInput,
  ProgramInquiry,
} from '../../libs/dto/trainingProgram/program.input';
import { T } from '../../libs/types/common';
import { Direction, Message } from '../../libs/enums/common.enum';
import { MemberService } from '../member/member.service';
import { ViewGroup } from '../../libs/enums/view.enum';
import { ViewInput } from '../../libs/dto/view/view.input';
import { ProgramUpdate } from '../../libs/dto/trainingProgram/program.update';
import { ProgramEnrollment } from '../../libs/dto/programEnrollment/programEnrollment';

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

  public async createProgram(
    input: ProgramInput,
    memberId: ObjectId,
  ): Promise<Program> {
    const programObject = {
      ...input,
      programStartDate: new Date(input.programStartDate),
      programEndDate: new Date(input.programEndDate),
      memberId,
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

  public async getPrograms(
    memberId: ObjectId,
    input: ProgramInquiry,
  ): Promise<Programs> {
    const match: T = {};
    const sort: T = {
      [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC,
    };

    if (input.search?.programName) {
      match.programName = { $regex: new RegExp(input.search.programName, 'i') };
    }

    if (input.search?.memberId) {
      match.memberId = input.search.memberId;
    }

    console.log('match', match);

    const result = await this.programModel
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

    if (!result.length)
      throw new InternalServerErrorException(Message.NO_DATA_FOUND);

    return result[0];
  }

  public async getOneProgram(
    memberId: ObjectId,
    programId: ObjectId,
  ): Promise<Program> {
    let result = await this.programModel.findOne({ _id: programId }).exec();

    if (!result) {
      throw new InternalServerErrorException(Message.NO_DATA_FOUND);
    }

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

    const result = await this.programModel.findByIdAndDelete(programId).exec();

    if (!result) {
      throw new InternalServerErrorException(Message.DELETE_FAILED);
    }

    // Decrement member's program count
    await this.memberService.updateMember(memberId, {
      $inc: { memberPrograms: -1 },
    });

    return result;
  }

  public async getMyPrograms(
    memberId: ObjectId,
    input: ProgramInquiry,
  ): Promise<Programs> {
    const match: T = { memberId: memberId };
    const sort: T = {
      [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC,
    };

    if (input.search?.programName) {
      match.programName = { $regex: new RegExp(input.search.programName, 'i') };
    }

    console.log('match', match);

    const result = await this.programModel
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

    if (!result.length)
      throw new InternalServerErrorException(Message.NO_DATA_FOUND);

    return result[0];
  }

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
          $replaceRoot: { newRoot: '$programData' },
        },
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

    if (!result.length)
      throw new InternalServerErrorException(Message.NO_DATA_FOUND);

    return result[0];
  }
  public async joinProgram(
    memberId: ObjectId,
    programId: string,
  ): Promise<ProgramEnrollment> {
    // Check if program exists
    const program = await this.programModel.findById(programId).exec();
    if (!program) {
      throw new InternalServerErrorException(Message.NO_DATA_FOUND);
    }

    // Check if already enrolled
    const existingEnrollment = await this.programEnrollmentModel
      .findOne({ memberId, programId })
      .exec();

    if (existingEnrollment) {
      throw new InternalServerErrorException(Message.ALREADY_JOINED);
    }

    // Create enrollment
    const enrollment = await this.programEnrollmentModel.create({
      memberId,
      programId,
    });

    if (!enrollment) {
      throw new InternalServerErrorException(Message.CREATE_FAILED);
    }

    // Increment program members count
    await this.programModel.findByIdAndUpdate(programId, {
      $inc: { programMembers: 1 },
    });

    return enrollment;
  }

  public async getProgramById(programId: ObjectId): Promise<Program> {
    const program = await this.programModel.findById(programId).exec();
    if (!program) {
      throw new InternalServerErrorException(Message.NO_DATA_FOUND);
    }
    return program;
  }

  public async leaveProgram(
    memberId: ObjectId,
    programId: string,
  ): Promise<ProgramEnrollment> {
    // Find enrollment
    const enrollment = await this.programEnrollmentModel
      .findOne({ memberId, programId })
      .exec();

    if (!enrollment) {
      throw new InternalServerErrorException('Not enrolled in this program');
    }

    // Delete enrollment
    const result = await this.programEnrollmentModel
      .findByIdAndDelete(enrollment._id)
      .exec();

    if (!result) {
      throw new InternalServerErrorException(Message.DELETE_FAILED);
    }

    // Decrement program members count
    await this.programModel.findByIdAndUpdate(programId, {
      $inc: { programMembers: -1 },
    });

    return result;
  }

  // In training-program.service.ts
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
}
