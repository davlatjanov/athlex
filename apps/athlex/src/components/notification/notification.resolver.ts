import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import type { ObjectId } from 'mongoose';
import { NotificationService } from './notification.service';
import {
  Notification,
  Notifications,
} from '../../libs/dto/notification/notification';
import { NotificationsInquiry } from '../../libs/dto/notification/notification.input';

@Resolver()
export class NotificationResolver {
  constructor(
    private readonly notificationService: NotificationService,
  ) {}

  @UseGuards(AuthGuard)
  @Query(() => Notifications)
  public async getMyNotifications(
    @Args('input') input: NotificationsInquiry,
    @AuthMember('_id') memberId: ObjectId,
  ): Promise<Notifications> {
    console.log('Query: getMyNotifications');
    return await this.notificationService.getMyNotifications(memberId, input);
  }

  @UseGuards(AuthGuard)
  @Query(() => Int)
  public async getUnreadNotificationCount(
    @AuthMember('_id') memberId: ObjectId,
  ): Promise<number> {
    console.log('Query: getUnreadNotificationCount');
    return await this.notificationService.getUnreadCount(memberId);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Notification)
  public async markNotificationAsRead(
    @Args('notificationId') notificationId: string,
    @AuthMember('_id') memberId: ObjectId,
  ): Promise<Notification> {
    console.log('Mutation: markNotificationAsRead');
    return await this.notificationService.markAsRead(memberId, notificationId);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  public async markAllNotificationsAsRead(
    @AuthMember('_id') memberId: ObjectId,
  ): Promise<boolean> {
    console.log('Mutation: markAllNotificationsAsRead');
    return await this.notificationService.markAllAsRead(memberId);
  }
}
