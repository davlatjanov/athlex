import { Field, ObjectType } from '@nestjs/graphql';
import type { ObjectId } from 'mongoose';
import { LikeGroup } from '../../enums/like.enum';

@ObjectType()
export class Like {
  @Field(() => String)
  _id: ObjectId;

  @Field(() => LikeGroup)
  likeGroup: LikeGroup;

  @Field(() => String)
  likeRefId: ObjectId;

  @Field(() => String)
  memberId: ObjectId;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}
