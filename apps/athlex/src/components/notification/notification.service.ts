// components/notification/notification.service.ts
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import {
  Notification,
  Notifications,
} from '../../libs/dto/notification/notification';
import {
  NotificationInput,
  NotificationUpdate,
  NotificationInquiry,
} from '../../libs/dto/notification/notification.input';
import { Direction, Message } from '../../libs/enums/common.enum';
import { shapeIntoMongoObjectId, lookupMember } from '../../libs/config';
import { T } from '../../libs/types/common';
import { NotificationStatus } from '../../libs/enums/notification.enum';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel('Notification')
    private notificationModel: Model<Notification>,
  ) {}

  public async createNotification(
    authorId: ObjectId,
    input: NotificationInput,
  ): Promise<Notification> {
    const receiverId = shapeIntoMongoObjectId(input.receiverId);
    const productId = input.productId
      ? shapeIntoMongoObjectId(input.productId)
      : null;
    const programId = input.programId
      ? shapeIntoMongoObjectId(input.programId)
      : null;

    const newNotification = await this.notificationModel.create({
      ...input,
      authorId,
      receiverId,
      productId,
      programId,
    });

    if (!newNotification) {
      throw new InternalServerErrorException(Message.CREATE_FAILED);
    }

    return newNotification;
  }

  public async updateNotification(
    memberId: ObjectId,
    input: NotificationUpdate,
  ): Promise<Notification> {
    const notificationIds = input.notificationIds.map((id) =>
      shapeIntoMongoObjectId(id),
    );

    // Update multiple notifications at once (mark as read)
    await this.notificationModel
      .updateMany(
        {
          _id: { $in: notificationIds },
          receiverId: memberId,
        },
        { notificationStatus: input.notificationStatus },
      )
      .exec();

    // Return the first one for response
    const result = await this.notificationModel
      .findById(notificationIds[0])
      .exec();

    if (!result) {
      throw new InternalServerErrorException(Message.UPDATE_FAILED);
    }

    return result;
  }

  public async getMyNotifications(
    memberId: ObjectId,
    input: NotificationInquiry,
  ): Promise<Notifications> {
    const { page, limit, sort, direction, notificationStatus } = input;
    const match: T = { receiverId: memberId };

    if (notificationStatus) {
      match.notificationStatus = notificationStatus;
    }

    const sortOption: T = {
      [sort ?? 'createdAt']: direction ?? Direction.DESC,
    };

    const result = await this.notificationModel
      .aggregate([
        { $match: match },
        { $sort: sortOption },
        {
          $facet: {
            list: [
              { $skip: (page - 1) * limit },
              { $limit: limit },
              {
                $lookup: {
                  from: 'members',
                  localField: 'authorId',
                  foreignField: '_id',
                  as: 'authorData',
                },
              },
              { $unwind: '$authorData' },
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
