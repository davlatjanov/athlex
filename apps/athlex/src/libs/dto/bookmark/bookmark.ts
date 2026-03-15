// libs/dto/bookmark/bookmark.ts
import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import type { ObjectId } from 'mongoose';
import { BookmarkGroup } from '../../enums/bookmark.enum';
import { TotalCounter } from '../member/member';

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
export class BookmarkItemPreview {
  @Field(() => String, { nullable: true })
  _id?: string;

  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => [String], { nullable: true })
  images?: string[];

  @Field(() => Float, { nullable: true })
  price?: number;

  @Field(() => String, { nullable: true })
  type?: string;

  @Field(() => String, { nullable: true })
  level?: string;

  @Field(() => Int, { nullable: true })
  views?: number;

  @Field(() => Int, { nullable: true })
  likes?: number;

  @Field(() => Int, { nullable: true })
  members?: number;

  @Field(() => Int, { nullable: true })
  duration?: number;

  @Field(() => Int, { nullable: true })
  rank?: number;
}

@ObjectType()
export class BookmarkedItem {
  @Field(() => String)
  _id: string;

  @Field(() => String)
  bookmarkRefId: string;

  @Field(() => BookmarkGroup)
  bookmarkGroup: BookmarkGroup;

  @Field(() => BookmarkItemPreview, { nullable: true })
  itemData?: BookmarkItemPreview;

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
