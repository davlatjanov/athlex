import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import type { ObjectId } from 'mongoose';
import { LikeService } from './like.service';
import { Like } from '../../libs/dto/like/like';
import { LikeInput } from '../../libs/dto/like/like.input';

@Resolver()
export class LikeResolver {
  constructor(private readonly likeService: LikeService) {}

  @UseGuards(AuthGuard)
  @Mutation(() => Like)
  public async likeTargetItem(
    @Args('input') input: LikeInput,
    @AuthMember('_id') memberId: ObjectId,
  ): Promise<Like> {
    console.log('Mutation: likeTargetItem');
    return await this.likeService.likeTargetItem(memberId, input);
  }

  @UseGuards(AuthGuard)
  @Query(() => Boolean)
  public async checkIfUserLiked(
    @Args('likeRefId') likeRefId: string,
    @AuthMember('_id') memberId: ObjectId,
  ): Promise<boolean> {
    console.log('Query: checkIfUserLiked');
    return await this.likeService.checkIfUserLiked(memberId, likeRefId);
  }
}
