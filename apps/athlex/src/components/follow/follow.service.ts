import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Follow, FollowingLikes } from '../../libs/dto/follow/follow';
import { FollowInput, FollowInquiry } from '../../libs/dto/follow/follow.input';
import { Followers } from '../../libs/dto/follow/followers';
import { Followings } from '../../libs/dto/follow/followings';
import { Message } from '../../libs/enums/common.enum';
import { MemberService } from '../member/member.service';
import { shapeIntoMongoObjectId } from '../../libs/config';
import { T } from '../../libs/types/common';

@Injectable()
export class FollowService {
  constructor(
    @InjectModel('Follow') private followModel: Model<Follow>,
    private readonly memberService: MemberService,
  ) {}

  public async followMember(
    memberId: ObjectId,
    input: FollowInput,
  ): Promise<Follow> {
    const followingId = shapeIntoMongoObjectId(input.followingId);

    // Prevent self-follow
    if (memberId.toString() === followingId.toString()) {
      throw new InternalServerErrorException('Cannot follow yourself');
    }

    // Check if already following
    const existingFollow = await this.followModel
      .findOne({ followerId: memberId, followingId })
      .exec();

    if (existingFollow) {
      // Unfollow
      await this.followModel.findByIdAndDelete(existingFollow._id).exec();

      // Update counts
      await this.memberService.updateMemberByFollow(memberId, -1, 'followings');
      await this.memberService.updateMemberByFollow(
        followingId,
        -1,
        'followers',
      );

      return existingFollow;
    } else {
      // Follow
      const newFollow = await this.followModel.create({
        followerId: memberId,
        followingId,
      });

      if (!newFollow) {
        throw new InternalServerErrorException(Message.CREATE_FAILED);
      }

      // Update counts
      await this.memberService.updateMemberByFollow(memberId, 1, 'followings');
      await this.memberService.updateMemberByFollow(
        followingId,
        1,
        'followers',
      );

      return newFollow;
    }
  }

  public async getFollowers(
    memberId: ObjectId,
    input: FollowInquiry,
  ): Promise<Followers> {
    const { page, limit } = input;

    const result = await this.followModel
      .aggregate([
        { $match: { followingId: memberId } },
        {
          $lookup: {
            from: 'members',
            localField: 'followerId',
            foreignField: '_id',
            as: 'followerData',
          },
        },
        { $unwind: '$followerData' },
        {
          $replaceRoot: { newRoot: '$followerData' },
        },
        {
          $facet: {
            list: [{ $skip: (page - 1) * limit }, { $limit: limit }],
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

  public async getFollowings(
    memberId: ObjectId,
    input: FollowInquiry,
  ): Promise<Followings> {
    const { page, limit } = input;

    const result = await this.followModel
      .aggregate([
        { $match: { followerId: memberId } },
        {
          $lookup: {
            from: 'members',
            localField: 'followingId',
            foreignField: '_id',
            as: 'followingData',
          },
        },
        { $unwind: '$followingData' },
        {
          $replaceRoot: { newRoot: '$followingData' },
        },
        {
          $facet: {
            list: [{ $skip: (page - 1) * limit }, { $limit: limit }],
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

  public async getFollowingLikes(
    memberId: ObjectId,
    input: FollowInquiry,
  ): Promise<FollowingLikes> {
    const { page, limit } = input;

    const result = await this.followModel
      .aggregate([
        // Get all people I follow
        { $match: { followerId: memberId } },
        {
          $lookup: {
            from: 'likes',
            localField: 'followingId',
            foreignField: 'memberId',
            as: 'likes',
          },
        },
        { $unwind: '$likes' },
        // Get the actual liked items (products/programs/members)
        {
          $lookup: {
            from: 'products',
            localField: 'likes.likeRefId',
            foreignField: '_id',
            as: 'productData',
          },
        },
        {
          $lookup: {
            from: 'programs',
            localField: 'likes.likeRefId',
            foreignField: '_id',
            as: 'programData',
          },
        },
        {
          $lookup: {
            from: 'members',
            localField: 'likes.likeRefId',
            foreignField: '_id',
            as: 'memberData',
          },
        },
        // Get follower info (person who liked)
        {
          $lookup: {
            from: 'members',
            localField: 'followingId',
            foreignField: '_id',
            as: 'followerInfo',
          },
        },
        { $unwind: '$followerInfo' },
        {
          $project: {
            _id: '$likes._id',
            likeGroup: '$likes.likeGroup',
            likedBy: '$followerInfo',
            likedItem: {
              $cond: {
                if: { $gt: [{ $size: '$productData' }, 0] },
                then: { $arrayElemAt: ['$productData', 0] },
                else: {
                  $cond: {
                    if: { $gt: [{ $size: '$programData' }, 0] },
                    then: { $arrayElemAt: ['$programData', 0] },
                    else: { $arrayElemAt: ['$memberData', 0] },
                  },
                },
              },
            },
            createdAt: '$likes.createdAt',
          },
        },
        { $sort: { createdAt: -1 } },
        {
          $facet: {
            list: [{ $skip: (page - 1) * limit }, { $limit: limit }],
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
}
