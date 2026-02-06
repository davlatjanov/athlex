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
import { NotificationService } from '../notification/notification.service';
import { ProductService } from '../product/product.service';
import { MemberService } from '../member/member.service';
import { TrainingProgramService } from '../training-program/training-program.service';
import {
  NotificationGroup,
  NotificationType,
} from '../../libs/enums/notification.enum';
import { FeedbackGroup } from '../../libs/enums/feedback.enum';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectModel('Feedback') private feedbackModel: Model<Feedback>,
    private readonly notificationService: NotificationService, // ✅ Add this
    private readonly productService: ProductService, // ✅ Add this
    private readonly trainingProgramService: TrainingProgramService, // ✅ Add this
    private readonly memberService: MemberService,
  ) {}

  public async createFeedback(
    memberId: ObjectId,
    input: FeedbackInput,
  ): Promise<Feedback> {
    const feedbackRefId = shapeIntoMongoObjectId(input.feedbackRefId);

    // Check if user already gave feedback for this item
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
    await this.createFeedbackNotification(memberId, input);
    return newFeedback;
  }

  private async createFeedbackNotification(
    authorId: ObjectId,
    input: FeedbackInput,
  ): Promise<void> {
    try {
      let receiverId: ObjectId;
      let notificationGroup: NotificationGroup;
      let notificationTitle: string;
      let productId: string | undefined;
      let programId: string | undefined;

      switch (input.feedbackGroup) {
        case FeedbackGroup.PRODUCT:
          // Products don't have owners, skip
          return;

        case FeedbackGroup.TRAINING_PROGRAM:
          const program = await this.trainingProgramService.getProgramById(
            shapeIntoMongoObjectId(input.feedbackRefId),
          );
          receiverId = program.memberId;
          notificationGroup = NotificationGroup.PROGRAM;
          notificationTitle = `gave ${input.feedbackScale} stars to your program`;
          programId = input.feedbackRefId;
          break;

        case FeedbackGroup.TRAINER:
          receiverId = shapeIntoMongoObjectId(input.feedbackRefId);
          notificationGroup = NotificationGroup.MEMBER;
          notificationTitle = `gave you ${input.feedbackScale} stars`;
          break;

        default:
          return;
      }

      // Don't notify yourself
      if (authorId.toString() === receiverId.toString()) {
        return;
      }

      await this.notificationService.createNotification(authorId, {
        notificationType: NotificationType.FEEDBACK,
        notificationGroup,
        notificationTitle,
        notificationDesc: input.feedbackContent.substring(0, 100),
        receiverId: receiverId.toString(),
        productId,
        programId,
      });
    } catch (error) {
      console.error('Failed to create feedback notification:', error);
    }
  }

  public async updateFeedback(
    memberId: ObjectId,
    input: FeedbackUpdate,
  ): Promise<Feedback> {
    const { _id, ...updateData } = input;
    const feedbackId = shapeIntoMongoObjectId(_id);

    // Verify ownership
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
    const match: T = {
      feedbackRefId: shapeIntoMongoObjectId(feedbackRefId),
      feedbackGroup,
    };

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
