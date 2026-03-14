import { Field, Int, ObjectType } from '@nestjs/graphql';
import mongoose from 'mongoose';
import { NotificationType } from '../../enums/notification.enum';
import { TotalCounter } from '../member/member';

@ObjectType()
export class Notification {
  @Field(() => String)
  _id: mongoose.ObjectId;

  @Field(() => String)
  recipientId: mongoose.ObjectId;

  @Field(() => String, { nullable: true })
  senderId?: mongoose.ObjectId;

  @Field(() => NotificationType)
  notificationType: NotificationType;

  @Field(() => String)
  notificationTitle: string;

  @Field(() => String)
  notificationMessage: string;

  @Field(() => String, { nullable: true })
  notificationLink?: string;

  @Field(() => Boolean)
  isRead: boolean;

  @Field(() => Date)
  createdAt?: Date;

  @Field(() => Date)
  updatedAt?: Date;
}

@ObjectType()
export class Notifications {
  @Field(() => [Notification])
  list: Notification[];

  @Field(() => [TotalCounter], { nullable: true })
  metaCounter: TotalCounter[];
}
