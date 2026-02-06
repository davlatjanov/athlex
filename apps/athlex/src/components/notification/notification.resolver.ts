// components/notification/notification.resolver.ts
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import type { ObjectId } from 'mongoose';
import { NotificationService } from './notification.service';
import {
  Notification,
  Notifications,
} from '../../libs/dto/notification/notification';
import {
  NotificationInput,
  NotificationUpdate,
  NotificationInquiry,
} from '../../libs/dto/notification/notification.input';
import { MemberType } from '../../libs/enums/member.enum';
import { shapeIntoMongoObjectId } from '../../libs/config';

@Resolver()
export class NotificationResolver {
  constructor(private readonly notificationService: NotificationService) {}

  @UseGuards(AuthGuard)
  @Mutation(() => Notification)
  public async createNotification(
    @Args('input') input: NotificationInput,
    @AuthMember('_id') authorId: ObjectId,
  ): Promise<Notification> {
    console.log('Mutation: createNotification');
    return await this.notificationService.createNotification(authorId, input);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Notification)
  public async updateNotification(
    @Args('input') input: NotificationUpdate,
    @AuthMember('_id') memberId: ObjectId,
  ): Promise<Notification> {
    console.log('Mutation: updateNotification');
    return await this.notificationService.updateNotification(memberId, input);
  }

  @UseGuards(AuthGuard)
  @Query(() => Notifications)
  public async getMyNotifications(
    @Args('input') input: NotificationInquiry,
    @AuthMember('_id') memberId: ObjectId,
  ): Promise<Notifications> {
    console.log('Query: getMyNotifications');
    return await this.notificationService.getMyNotifications(memberId, input);
  }

  // Admin create notification for user
  @UseGuards(RolesGuard)
  @Roles(MemberType.ADMIN)
  @Mutation(() => Notification)
  public async createNotificationByAdmin(
    @Args('input') input: NotificationInput,
    @AuthMember('_id') authorId: ObjectId,
  ): Promise<Notification> {
    console.log('Mutation: createNotificationByAdmin');
    return await this.notificationService.createNotification(authorId, input);
  }
}
