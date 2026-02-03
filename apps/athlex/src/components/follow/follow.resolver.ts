import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import type { ObjectId } from 'mongoose';
import { FollowService } from './follow.service';
import { Follow } from '../../libs/dto/follow/follow';
import { FollowInput, FollowInquiry } from '../../libs/dto/follow/follow.input';
import { Followers } from '../../libs/dto/follow/followers';
import { Followings } from '../../libs/dto/follow/followings';

import { WithoutGuard } from '../auth/guards/without.guard';
import { shapeIntoMongoObjectId } from '../../libs/config';

@Resolver()
export class FollowResolver {
  constructor(private readonly followService: FollowService) {}

  @UseGuards(AuthGuard)
  @Mutation(() => Follow)
  public async followMember(
    @Args('input') input: FollowInput,
    @AuthMember('_id') memberId: ObjectId,
  ): Promise<Follow> {
    console.log('Mutation: followMember');
    return await this.followService.followMember(memberId, input);
  }

  @UseGuards(WithoutGuard)
  @Query(() => Followers)
  public async getFollowers(
    @Args('memberId') memberId: string,
    @Args('input') input: FollowInquiry,
  ): Promise<Followers> {
    console.log('Query: getFollowers');
    const targetId = shapeIntoMongoObjectId(memberId);
    return await this.followService.getFollowers(targetId, input);
  }

  @UseGuards(WithoutGuard)
  @Query(() => Followings)
  public async getFollowings(
    @Args('memberId') memberId: string,
    @Args('input') input: FollowInquiry,
  ): Promise<Followings> {
    console.log('Query: getFollowings');
    const targetId = shapeIntoMongoObjectId(memberId);
    return await this.followService.getFollowings(targetId, input);
  }
}
