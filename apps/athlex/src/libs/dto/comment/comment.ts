// libs/dto/comment/comment.ts
import { Field, ObjectType } from '@nestjs/graphql';
import type { ObjectId } from 'mongoose';
import { CommentGroup, CommentStatus } from '../../enums/comment.enum';
import { Member, TotalCounter } from '../member/member';

@ObjectType()
export class Comment {
  @Field(() => String)
  _id: ObjectId;

  @Field(() => CommentStatus)
  commentStatus: CommentStatus;

  @Field(() => CommentGroup)
  commentGroup: CommentGroup;

  @Field(() => String)
  commentContent: string;

  @Field(() => String)
  commentRefId: ObjectId;

  @Field(() => String)
  memberId: ObjectId;

  @Field(() => Member, { nullable: true })
  memberData?: Member;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}
// libs/dto/comment/comments.ts

@ObjectType()
export class Comments {
  @Field(() => [Comment])
  list: Comment[];

  @Field(() => [TotalCounter], { nullable: true })
  metaCounter: TotalCounter[];
}
