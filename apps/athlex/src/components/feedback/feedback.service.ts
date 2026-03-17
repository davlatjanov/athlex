import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Feedback } from '../../libs/dto/feedback/feedback';
import { Feedbacks } from '../../libs/dto/feedback/feedbacks';
import { FeedbackInput } from '../../libs/dto/feedback/feedback.input';
import { FeedbackUpdate } from '../../libs/dto/feedback/feedback.update';
import { FeedbackInquiry } from '../../libs/dto/feedback/feedback.inquiry';
import { Direction, Message } from '../../libs/enums/common.enum';
import { shapeIntoMongoObjectId } from '../../libs/config';
import { T } from '../../libs/types/common';
import { lookupMember } from '../../libs/config';

import { ProductService } from '../product/product.service';
import { MemberService } from '../member/member.service';
import { TrainingProgramService } from '../training-program/training-program.service';

import { FeedbackGroup } from '../../libs/enums/feedback.enum';
import { NotificationService } from '../notification/notification.service';
import { NotificationType } from '../../libs/enums/notification.enum';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectModel('Feedback') private feedbackModel: Model<Feedback>,
    private readonly productService: ProductService, // ✅ Add this
    private readonly trainingProgramService: TrainingProgramService, // ✅ Add this
    private readonly memberService: MemberService,
    private readonly notificationService: NotificationService,
  ) {}

  public async createFeedback(
    memberId: ObjectId,
    input: FeedbackInput,
  ): Promise<Feedback> {
    const feedbackRefId = shapeIntoMongoObjectId(input.feedbackRefId);

    const existingFeedback = await this.feedbackModel
      .findOne({ memberId, feedbackGroup: input.feedbackGroup, feedbackRefId })
      .exec();

    if (existingFeedback) {
      throw new InternalServerErrorException(
        'You have already provided feedback for this item',
      );
    }

    const newFeedback = await this.feedbackModel.create({
      ...input,
      feedbackRefId,
      memberId,
    });

    if (!newFeedback) {
      throw new InternalServerErrorException(Message.CREATE_FAILED);
    }

    // Notify owner
    try {
      let recipientId: string | null = null;
      if (input.feedbackGroup === FeedbackGroup.TRAINING_PROGRAM) {
        const program = await this.trainingProgramService.getProgramById(shapeIntoMongoObjectId(input.feedbackRefId));
        if (program) recipientId = program.memberId.toString();
      }
      if (recipientId && recipientId !== memberId.toString()) {
        await this.notificationService.createNotification({
          recipientId,
          senderId: memberId.toString(),
          notificationType: NotificationType.FEEDBACK_RECEIVED,
          notificationTitle: 'New feedback received',
          notificationMessage: (input.feedbackContent ?? '').slice(0, 80),
          notificationLink: `/programs/${input.feedbackRefId}`,
        });
      }
    } catch (_) {}

    return newFeedback;
  }

  public async updateFeedback(
    memberId: ObjectId,
    input: FeedbackUpdate,
  ): Promise<Feedback> {
    const { _id, ...updateData } = input;
    const feedbackId = shapeIntoMongoObjectId(_id);

    const feedback = await this.feedbackModel
      .findOne({ _id: feedbackId, memberId })
      .exec();

    if (!feedback) {
      throw new InternalServerErrorException(Message.UPDATE_FAILED);
    }

    const result = await this.feedbackModel
      .findByIdAndUpdate(feedbackId, updateData, { new: true })
      .exec();

    if (!result) {
      throw new InternalServerErrorException(Message.UPDATE_FAILED);
    }

    return result;
  }

  public async deleteFeedback(
    memberId: ObjectId,
    feedbackId: ObjectId,
  ): Promise<Feedback> {
    // Verify ownership
    const feedback = await this.feedbackModel
      .findOne({ _id: feedbackId, memberId })
      .exec();

    if (!feedback) {
      throw new InternalServerErrorException(Message.DELETE_FAILED);
    }

    const result = await this.feedbackModel
      .findByIdAndDelete(feedbackId)
      .exec();

    if (!result) {
      throw new InternalServerErrorException(Message.DELETE_FAILED);
    }

    return result;
  }

  public async getFeedbacks(input: FeedbackInquiry): Promise<Feedbacks> {
    const { page, limit, sort, direction, feedbackRefId, feedbackGroup } =
      input;
    const match: T = {};
    if (feedbackRefId) match.feedbackRefId = shapeIntoMongoObjectId(feedbackRefId);
    if (feedbackGroup) match.feedbackGroup = feedbackGroup;

    const sortOption: T = {
      [sort ?? 'createdAt']: direction ?? Direction.DESC,
    };

    const result = await this.feedbackModel
      .aggregate([
        { $match: match },
        { $sort: sortOption },
        {
          $facet: {
            list: [
              { $skip: (page - 1) * limit },
              { $limit: limit },
              lookupMember,
              { $unwind: '$memberData' },
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

  // Admin method
  public async deleteFeedbackByAdmin(feedbackId: ObjectId): Promise<Feedback> {
    const result = await this.feedbackModel
      .findByIdAndDelete(feedbackId)
      .exec();

    if (!result) {
      throw new InternalServerErrorException(Message.DELETE_FAILED);
    }

    return result;
  }
}
