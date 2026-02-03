import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import type { ObjectId } from 'mongoose';
import { FeedbackService } from './feedback.service';
import { Feedback } from '../../libs/dto/feedback/feedback';
import { Feedbacks } from '../../libs/dto/feedback/feedbacks';
import { FeedbackInput } from '../../libs/dto/feedback/feedback.input';
import { FeedbackUpdate } from '../../libs/dto/feedback/feedback.update';
import { FeedbackInquiry } from '../../libs/dto/feedback/feedback.inquiry';
import { WithoutGuard } from '../auth/guards/without.guard';
import { shapeIntoMongoObjectId } from '../../libs/config';
import { MemberType } from '../../libs/enums/member.enum';

@Resolver()
export class FeedbackResolver {
  constructor(private readonly feedbackService: FeedbackService) {}

  @UseGuards(AuthGuard)
  @Mutation(() => Feedback)
  public async createFeedback(
    @Args('input') input: FeedbackInput,
    @AuthMember('_id') memberId: ObjectId,
  ): Promise<Feedback> {
    console.log('Mutation: createFeedback');
    return await this.feedbackService.createFeedback(memberId, input);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Feedback)
  public async updateFeedback(
    @Args('input') input: FeedbackUpdate,
    @AuthMember('_id') memberId: ObjectId,
  ): Promise<Feedback> {
    console.log('Mutation: updateFeedback');
    return await this.feedbackService.updateFeedback(memberId, input);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Feedback)
  public async deleteFeedback(
    @Args('feedbackId') feedbackId: string,
    @AuthMember('_id') memberId: ObjectId,
  ): Promise<Feedback> {
    console.log('Mutation: deleteFeedback');
    const _id = shapeIntoMongoObjectId(feedbackId);
    return await this.feedbackService.deleteFeedback(memberId, _id);
  }

  @UseGuards(WithoutGuard)
  @Query(() => Feedbacks)
  public async getFeedbacks(
    @Args('input') input: FeedbackInquiry,
  ): Promise<Feedbacks> {
    console.log('Query: getFeedbacks');
    return await this.feedbackService.getFeedbacks(input);
  }

  // Admin APIs
  @UseGuards(RolesGuard)
  @Roles(MemberType.ADMIN)
  @Mutation(() => Feedback)
  public async deleteFeedbackByAdmin(
    @Args('feedbackId') feedbackId: string,
  ): Promise<Feedback> {
    console.log('Mutation: deleteFeedbackByAdmin');
    const _id = shapeIntoMongoObjectId(feedbackId);
    return await this.feedbackService.deleteFeedbackByAdmin(_id);
  }
}
