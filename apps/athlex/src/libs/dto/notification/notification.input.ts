// libs/dto/notification/notification.input.ts
import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, Min } from 'class-validator';
import {
  NotificationType,
  NotificationStatus,
  NotificationGroup,
} from '../../enums/notification.enum';
import { Direction } from '../../enums/common.enum';

@InputType()
export class NotificationInput {
  @IsNotEmpty()
  @Field(() => NotificationType)
  notificationType: NotificationType;

  @IsNotEmpty()
  @Field(() => NotificationGroup)
  notificationGroup: NotificationGroup;

  @IsNotEmpty()
  @Field(() => String)
  notificationTitle: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  notificationDesc?: string;

  @IsNotEmpty()
  @Field(() => String)
  receiverId: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  productId?: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  programId?: string;
}

@InputType()
export class NotificationUpdate {
  @IsNotEmpty()
  @Field(() => [String])
  notificationIds: string[];

  @IsNotEmpty()
  @Field(() => NotificationStatus)
  notificationStatus: NotificationStatus;
}

@InputType()
export class NotificationInquiry {
  @IsNotEmpty()
  @Min(1)
  @Field(() => Int)
  page: number;

  @IsNotEmpty()
  @Min(1)
  @Field(() => Int)
  limit: number;

  @IsOptional()
  @Field(() => String, { nullable: true })
  sort?: string;

  @IsOptional()
  @Field(() => Direction, { nullable: true })
  direction?: Direction;

  @IsOptional()
  @Field(() => NotificationStatus, { nullable: true })
  notificationStatus?: NotificationStatus;
}
