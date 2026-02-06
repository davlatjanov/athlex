// components/bookmark/bookmark.resolver.ts
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import type { ObjectId } from 'mongoose';
import { BookmarkService } from './bookmark.service';
import { Bookmark, Bookmarks } from '../../libs/dto/bookmark/bookmark';
import {
  BookmarkInput,
  BookmarkInquiry,
} from '../../libs/dto/bookmark/bookmark.input';

@Resolver()
export class BookmarkResolver {
  constructor(private readonly bookmarkService: BookmarkService) {}

  @UseGuards(AuthGuard)
  @Mutation(() => Bookmark)
  public async toggleBookmark(
    @Args('input') input: BookmarkInput,
    @AuthMember('_id') memberId: ObjectId,
  ): Promise<Bookmark> {
    console.log('Mutation: toggleBookmark');
    return await this.bookmarkService.toggleBookmark(memberId, input);
  }

  @UseGuards(AuthGuard)
  @Query(() => Bookmarks)
  public async getMyBookmarks(
    @Args('input') input: BookmarkInquiry,
    @AuthMember('_id') memberId: ObjectId,
  ): Promise<Bookmarks> {
    console.log('Query: getMyBookmarks');
    return await this.bookmarkService.getMyBookmarks(memberId, input);
  }
}
