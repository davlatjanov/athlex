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
