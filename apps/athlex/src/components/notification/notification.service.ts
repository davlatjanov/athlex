import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import {
  Notification,
  Notifications,
} from '../../libs/dto/notification/notification';
import {
  NotificationInput,
  NotificationsInquiry,
} from '../../libs/dto/notification/notification.input';
import { Direction, Message } from '../../libs/enums/common.enum';
import { T } from '../../libs/types/common';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel('Notification')
    private notificationModel: Model<Notification>,
  ) {}

  public async createNotification(
    input: NotificationInput,
  ): Promise<Notification> {
    const notification = await this.notificationModel.create(input);
    if (!notification) {
      throw new InternalServerErrorException(Message.CREATE_FAILED);
    }
    return notification;
  }

  public async getMyNotifications(
    memberId: ObjectId,
    input: NotificationsInquiry,
  ): Promise<Notifications> {
    const match: T = { recipientId: memberId };

    if (typeof input.isRead === 'boolean') {
      match.isRead = input.isRead;
    }

    const sort: T = {
      [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC,
    };

    const page = input.page ?? 1;
    const limit = input.limit ?? 20;

    const result = await this.notificationModel
      .aggregate([
        { $match: match },
        { $sort: sort },
        {
          $facet: {
            list: [
              { $skip: (page - 1) * limit },
              { $limit: limit },
              {
                $lookup: {
                  from: 'members',
                  localField: 'senderId',
                  foreignField: '_id',
                  as: 'senderData',
                },
              },
              {
                $unwind: {
                  path: '$senderData',
                  preserveNullAndEmptyArrays: true,
                },
              },
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

  public async markAsRead(
    memberId: ObjectId,
    notificationId: string,
  ): Promise<Notification> {
    const result = await this.notificationModel
      .findOneAndUpdate(
        { _id: notificationId, recipientId: memberId },
        { isRead: true },
        { new: true },
      )
      .exec();

    if (!result) {
      throw new InternalServerErrorException(Message.UPDATE_FAILED);
    }
    return result;
  }

  public async markAllAsRead(memberId: ObjectId): Promise<boolean> {
    await this.notificationModel
      .updateMany({ recipientId: memberId, isRead: false }, { isRead: true })
      .exec();
    return true;
  }

  public async getUnreadCount(memberId: ObjectId): Promise<number> {
    return await this.notificationModel
      .countDocuments({ recipientId: memberId, isRead: false })
      .exec();
  }
}
