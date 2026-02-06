// libs/dto/notification/notification.ts
import { Field, Int, ObjectType } from '@nestjs/graphql';
import type { ObjectId } from 'mongoose';
import {
  NotificationType,
  NotificationStatus,
  NotificationGroup,
} from '../../enums/notification.enum';
import { Member } from '../member/member';
import { TotalCounter } from '../member/member';

@ObjectType()
export class Notification {
  @Field(() => String)
  _id: ObjectId;

  @Field(() => NotificationType)
  notificationType: NotificationType;

  @Field(() => NotificationStatus)
  notificationStatus: NotificationStatus;

  @Field(() => NotificationGroup)
  notificationGroup: NotificationGroup;

  @Field(() => String)
  notificationTitle: string;

  @Field(() => String, { nullable: true })
  notificationDesc?: string;

  @Field(() => String)
  authorId: ObjectId;

  @Field(() => String)
  receiverId: ObjectId;

  @Field(() => String, { nullable: true })
  productId?: ObjectId;

  @Field(() => String, { nullable: true })
  programId?: ObjectId;

  @Field(() => Member, { nullable: true })
  authorData?: Member;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}

@ObjectType()
export class Notifications {
  @Field(() => [Notification])
  list: Notification[];

  @Field(() => [TotalCounter], { nullable: true })
  metaCounter: TotalCounter[];
}
