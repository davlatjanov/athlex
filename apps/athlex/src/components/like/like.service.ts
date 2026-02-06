import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Like } from '../../libs/dto/like/like';
import { LikeInput } from '../../libs/dto/like/like.input';
import { Message } from '../../libs/enums/common.enum';
import { LikeGroup } from '../../libs/enums/like.enum';
import { MemberService } from '../member/member.service';
import { ProductService } from '../product/product.service';
import { TrainingProgramService } from '../training-program/training-program.service';
import { shapeIntoMongoObjectId } from '../../libs/config';
import { NotificationService } from '../notification/notification.service';
import {
  NotificationGroup,
  NotificationType,
} from '../../libs/enums/notification.enum';

@Injectable()
export class LikeService {
  constructor(
    @InjectModel('Like') private likeModel: Model<Like>,
    private readonly memberService: MemberService,
    private readonly productService: ProductService,
    private readonly trainingProgramService: TrainingProgramService,
    private readonly notificationService: NotificationService,
  ) {}

  public async likeTargetItem(
    memberId: ObjectId,
    input: LikeInput,
  ): Promise<Like> {
    const { likeGroup, likeRefId } = input;

    // Check if already liked
    const existingLike = await this.likeModel
      .findOne({ memberId, likeRefId })
      .exec();

    if (existingLike) {
      // Unlike - remove the like
      await this.likeModel.findByIdAndDelete(existingLike._id).exec();

      // Decrement like count based on group
      await this.updateLikeCount(likeGroup, likeRefId, -1);

      return existingLike;
    } else {
      // Like - create new like
      const newLike = await this.likeModel.create({
        memberId,
        likeRefId,
        likeGroup,
      });

      if (!newLike) {
        throw new InternalServerErrorException(Message.CREATE_FAILED);
      }

      // Increment like count based on group
      await this.updateLikeCount(likeGroup, likeRefId, 1);

      await this.createLikeNotification(memberId, likeGroup, likeRefId);

      return newLike;
    }
  }

  private async createLikeNotification(
    authorId: ObjectId,
    likeGroup: LikeGroup,
    likeRefId: string,
  ): Promise<void> {
    try {
      let receiverId: ObjectId;
      let notificationTitle: string;
      let notificationGroup: NotificationGroup;
      let productId: string | undefined;
      let programId: string | undefined;

      switch (likeGroup) {
        case LikeGroup.MEMBER:
          receiverId = shapeIntoMongoObjectId(likeRefId);
          notificationTitle = 'liked your profile';
          notificationGroup = NotificationGroup.MEMBER;
          break;

        case LikeGroup.PRODUCT:
          // Get product to find owner (if you track product owners)
          // For now, skip notification for products
          return;

        case LikeGroup.PROGRAM:
          // Get program owner
          const program = await this.trainingProgramService.getProgramById(
            shapeIntoMongoObjectId(likeRefId),
          );
          receiverId = program.memberId;
          notificationTitle = 'liked your program';
          notificationGroup = NotificationGroup.PROGRAM;
          programId = likeRefId;
          break;

        default:
          return;
      }

      // Don't notify yourself
      if (authorId.toString() === receiverId.toString()) {
        return;
      }

      await this.notificationService.createNotification(authorId, {
        notificationType: NotificationType.LIKE,
        notificationGroup,
        notificationTitle,
        receiverId: receiverId.toString(),
        productId,
        programId,
      });
    } catch (error) {
      // Don't fail the like operation if notification fails
      console.error('Failed to create like notification:', error);
    }
  }

  private async updateLikeCount(
    likeGroup: LikeGroup,
    likeRefId: string,
    increment: number,
  ): Promise<void> {
    const targetId = shapeIntoMongoObjectId(likeRefId);

    switch (likeGroup) {
      case LikeGroup.MEMBER:
        await this.memberService.updateMemberByLike(targetId, increment);
        break;

      case LikeGroup.PRODUCT:
        await this.productService.updateProductByLike(targetId, increment);
        break;

      case LikeGroup.PROGRAM:
        await this.trainingProgramService.updateProgramByLike(
          targetId,
          increment,
        );
        break;

      default:
        break;
    }
  }
}
