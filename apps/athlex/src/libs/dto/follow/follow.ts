import { LikeGroup } from '../../enums/like.enum';
import { Member } from '../member/member';
import { TotalCounter } from '../member/member';
// libs/dto/follow/follow.ts
import { Field, ObjectType } from '@nestjs/graphql';
import type { ObjectId } from 'mongoose';

@ObjectType()
export class Follow {
  @Field(() => String)
  _id: ObjectId;

  @Field(() => String)
  followingId: ObjectId;

  @Field(() => String)
  followerId: ObjectId;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}

// libs/dto/follow/following-likes.ts

@ObjectType()
export class LikedItem {
  @Field(() => String)
  _id: string;

  @Field(() => String, { nullable: true })
  productName?: string;

  @Field(() => String, { nullable: true })
  programName?: string;

  @Field(() => String, { nullable: true })
  memberNick?: string;

  @Field(() => [String], { nullable: true })
  productImages?: string[];

  @Field(() => [String], { nullable: true })
  programImages?: string[];

  @Field(() => String, { nullable: true })
  memberImage?: string;
}

@ObjectType()
export class FollowingLike {
  @Field(() => String)
  _id: string;

  @Field(() => LikeGroup)
  likeGroup: LikeGroup;

  @Field(() => Member)
  likedBy: Member;

  @Field(() => LikedItem)
  likedItem: LikedItem;

  @Field(() => Date)
  createdAt: Date;
}

@ObjectType()
export class FollowingLikes {
  @Field(() => [FollowingLike])
  list: FollowingLike[];

  @Field(() => [TotalCounter], { nullable: true })
  metaCounter: TotalCounter[];
}
