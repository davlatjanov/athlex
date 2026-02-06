import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Comment } from '../../libs/dto/comment/comment';
import { Comments } from '../../libs/dto/comment/comment';
import { CommentInput } from '../../libs/dto/comment/comment.input';
import { CommentUpdate } from '../../libs/dto/comment/comment.update';
import { CommentInquiry } from '../../libs/dto/comment/comment.inquiry';
import { Direction, Message } from '../../libs/enums/common.enum';

import { MemberService } from '../member/member.service';
import { shapeIntoMongoObjectId } from '../../libs/config';
import { T } from '../../libs/types/common';
import { lookupMember } from '../../libs/config';
import { CommentGroup, CommentStatus } from '../../libs/enums/comment.enum';
import { NotificationService } from '../notification/notification.service';
import { ProductService } from '../product/product.service';
import { TrainingProgramService } from '../training-program/training-program.service';
import {
  NotificationGroup,
  NotificationType,
} from '../../libs/enums/notification.enum';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel('Comment') private commentModel: Model<Comment>,
    private readonly memberService: MemberService,
    private readonly notificationService: NotificationService,
    private readonly productService: ProductService,
    private readonly trainingProgramService: TrainingProgramService,
  ) {}

  public async createComment(
    memberId: ObjectId,
    input: CommentInput,
  ): Promise<Comment> {
    const commentRefId = shapeIntoMongoObjectId(input.commentRefId);

    const newComment = await this.commentModel.create({
      ...input,
      commentRefId,
      memberId,
    });

    if (!newComment) {
      throw new InternalServerErrorException(Message.CREATE_FAILED);
    }

    // Increment member comments count
    await this.memberService.updateMemberByComment(memberId, 1);
    await this.createCommentNotification(memberId, input);
    return newComment;
  }

  private async createCommentNotification(
    authorId: ObjectId,
    input: CommentInput,
  ): Promise<void> {
    try {
      let receiverId: ObjectId;
      let notificationGroup: NotificationGroup;
      let productId: string | undefined;
      let programId: string | undefined;

      switch (input.commentGroup) {
        case CommentGroup.PRODUCT:
          // Products don't have owners in your schema, skip notification
          return;

        case CommentGroup.PROGRAM:
          const program = await this.trainingProgramService.getProgramById(
            shapeIntoMongoObjectId(input.commentRefId),
          );
          receiverId = program.memberId;
          notificationGroup = NotificationGroup.PROGRAM;
          programId = input.commentRefId;
          break;

        default:
          return;
      }

      // Don't notify yourself
      if (authorId.toString() === receiverId.toString()) {
        return;
      }

      await this.notificationService.createNotification(authorId, {
        notificationType: NotificationType.COMMENT,
        notificationGroup,
        notificationTitle: 'commented on your program',
        notificationDesc: input.commentContent.substring(0, 100), // First 100 chars
        receiverId: receiverId.toString(),
        productId,
        programId,
      });
    } catch (error) {
      console.error('Failed to create comment notification:', error);
    }
  }

  public async updateComment(
    memberId: ObjectId,
    input: CommentUpdate,
  ): Promise<Comment> {
    const { _id, ...updateData } = input;
    const commentId = shapeIntoMongoObjectId(_id);

    // Verify ownership
    const comment = await this.commentModel
      .findOne({ _id: commentId, memberId })
      .exec();

    if (!comment) {
      throw new InternalServerErrorException(Message.UPDATE_FAILED);
    }

    const result = await this.commentModel
      .findByIdAndUpdate(commentId, updateData, { new: true })
      .exec();

    if (!result) {
      throw new InternalServerErrorException(Message.UPDATE_FAILED);
    }

    return result;
  }

  public async deleteComment(
    memberId: ObjectId,
    commentId: ObjectId,
  ): Promise<Comment> {
    // Verify ownership
    const comment = await this.commentModel
      .findOne({ _id: commentId, memberId })
      .exec();

    if (!comment) {
      throw new InternalServerErrorException(Message.DELETE_FAILED);
    }

    const result = await this.commentModel.findByIdAndDelete(commentId).exec();

    if (!result) {
      throw new InternalServerErrorException(Message.DELETE_FAILED);
    }

    // Decrement member comments count
    await this.memberService.updateMemberByComment(memberId, -1);

    return result;
  }

  public async getComments(input: CommentInquiry): Promise<Comments> {
    const { page, limit, sort, direction, commentRefId, commentGroup } = input;
    const match: T = {
      commentStatus: CommentStatus.ACTIVE,
      commentRefId: shapeIntoMongoObjectId(commentRefId),
      commentGroup,
    };

    const sortOption: T = {
      [sort ?? 'createdAt']: direction ?? Direction.DESC,
    };

    const result = await this.commentModel
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

  // ... existing methods stay the same ...

  // Admin methods
  public async updateCommentByAdmin(input: CommentUpdate): Promise<Comment> {
    const { _id, ...updateData } = input;
    const commentId = shapeIntoMongoObjectId(_id);

    const result = await this.commentModel
      .findByIdAndUpdate(commentId, updateData, { new: true })
      .exec();

    if (!result) {
      throw new InternalServerErrorException(Message.UPDATE_FAILED);
    }

    return result;
  }

  public async deleteCommentByAdmin(commentId: ObjectId): Promise<Comment> {
    const comment = await this.commentModel.findById(commentId).exec();

    if (!comment) {
      throw new InternalServerErrorException(Message.DELETE_FAILED);
    }

    const result = await this.commentModel.findByIdAndDelete(commentId).exec();

    if (!result) {
      throw new InternalServerErrorException(Message.DELETE_FAILED);
    }

    // Decrement the comment owner's count
    await this.memberService.updateMemberByComment(comment.memberId, -1);

    return result;
  }
}
