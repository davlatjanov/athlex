// libs/dto/bookmark/bookmark.ts
import { Field, ObjectType } from '@nestjs/graphql';
import type { ObjectId } from 'mongoose';
import { BookmarkGroup } from '../../enums/bookmark.enum';
import { TotalCounter } from '../member/member';
import { Program } from '../trainingProgram/program';
import { ProgressResult } from '../progress-result.ts/progress-result';
import { Product } from '../product/product';

@ObjectType()
export class Bookmark {
  @Field(() => String)
  _id: ObjectId;

  @Field(() => String)
  memberId: ObjectId;

  @Field(() => String)
  bookmarkRefId: ObjectId;

  @Field(() => BookmarkGroup)
  bookmarkGroup: BookmarkGroup;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}

@ObjectType()
export class BookmarkedItem {
  @Field(() => String)
  _id: string;

  @Field(() => BookmarkGroup)
  bookmarkGroup: BookmarkGroup;

  @Field(() => Product || Program || ProgressResult, { nullable: true })
  itemData?: any;

  @Field(() => Date)
  createdAt: Date;
}

@ObjectType()
export class Bookmarks {
  @Field(() => [BookmarkedItem])
  list: BookmarkedItem[];

  @Field(() => [TotalCounter], { nullable: true })
  metaCounter: TotalCounter[];
}
