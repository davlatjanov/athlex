import { Field, InputType, Int } from '@nestjs/graphql';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { NotificationType } from '../../enums/notification.enum';
import { Direction } from '../../enums/common.enum';

@InputType()
export class NotificationInput {
  @IsNotEmpty()
  @Field(() => String)
  recipientId: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  senderId?: string;

  @IsNotEmpty()
  @IsEnum(NotificationType)
  @Field(() => NotificationType)
  notificationType: NotificationType;

  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  notificationTitle: string;

  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  notificationMessage: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  notificationLink?: string;
}

@InputType()
export class NotificationsInquiry {
  @IsOptional()
  @Field(() => Int, { nullable: true })
  page?: number;

  @IsOptional()
  @Field(() => Int, { nullable: true })
  limit?: number;

  @IsOptional()
  @Field(() => Boolean, { nullable: true })
  isRead?: boolean;

  @IsOptional()
  @Field(() => String, { nullable: true })
  sort?: string;

  @IsOptional()
  @IsEnum(Direction)
  @Field(() => Direction, { nullable: true })
  direction?: Direction;
}
