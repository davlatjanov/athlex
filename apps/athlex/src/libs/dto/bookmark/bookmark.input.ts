// libs/dto/bookmark/bookmark.input.ts
import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, Min } from 'class-validator';
import { BookmarkGroup } from '../../enums/bookmark.enum';
import { Direction } from '../../enums/common.enum';

@InputType()
export class BookmarkInput {
  @IsNotEmpty()
  @Field(() => String)
  bookmarkRefId: string;

  @IsNotEmpty()
  @Field(() => BookmarkGroup)
  bookmarkGroup: BookmarkGroup;
}

@InputType()
export class BookmarkInquiry {
  @IsNotEmpty()
  @Min(1)
  @Field(() => Int)
  page: number;

  @IsNotEmpty()
  @Min(1)
  @Field(() => Int)
  limit: number;

  @IsOptional()
  @Field(() => String, { nullable: true })
  sort?: string;

  @IsOptional()
  @Field(() => Direction, { nullable: true })
  direction?: Direction;

  @IsOptional()
  @Field(() => BookmarkGroup, { nullable: true })
  bookmarkGroup?: BookmarkGroup;
}
