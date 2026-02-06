// components/bookmark/bookmark.service.ts
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Bookmark, Bookmarks } from '../../libs/dto/bookmark/bookmark';
import {
  BookmarkInput,
  BookmarkInquiry,
} from '../../libs/dto/bookmark/bookmark.input';
import { Direction, Message } from '../../libs/enums/common.enum';
import { shapeIntoMongoObjectId } from '../../libs/config';
import { T } from '../../libs/types/common';
import { BookmarkGroup } from '../../libs/enums/bookmark.enum';

@Injectable()
export class BookmarkService {
  constructor(
    @InjectModel('Bookmark') private bookmarkModel: Model<Bookmark>,
  ) {}

  public async toggleBookmark(
    memberId: ObjectId,
    input: BookmarkInput,
  ): Promise<Bookmark> {
    const bookmarkRefId = shapeIntoMongoObjectId(input.bookmarkRefId);

    // Check if already bookmarked
    const existingBookmark = await this.bookmarkModel
      .findOne({ memberId, bookmarkRefId })
      .exec();

    if (existingBookmark) {
      // Remove bookmark
      await this.bookmarkModel.findByIdAndDelete(existingBookmark._id).exec();
      return existingBookmark;
    } else {
      // Add bookmark
      const newBookmark = await this.bookmarkModel.create({
        memberId,
        bookmarkRefId,
        bookmarkGroup: input.bookmarkGroup,
      });

      if (!newBookmark) {
        throw new InternalServerErrorException(Message.CREATE_FAILED);
      }

      return newBookmark;
    }
  }

  public async getMyBookmarks(
    memberId: ObjectId,
    input: BookmarkInquiry,
  ): Promise<Bookmarks> {
    const { page, limit, sort, direction, bookmarkGroup } = input;
    const match: T = { memberId };

    if (bookmarkGroup) {
      match.bookmarkGroup = bookmarkGroup;
    }

    const sortOption: T = {
      [sort ?? 'createdAt']: direction ?? Direction.DESC,
    };

    const result = await this.bookmarkModel
      .aggregate([
        { $match: match },
        { $sort: sortOption },
        // Lookup products
        {
          $lookup: {
            from: 'products',
            localField: 'bookmarkRefId',
            foreignField: '_id',
            as: 'productData',
          },
        },
        // Lookup programs
        {
          $lookup: {
            from: 'programs',
            localField: 'bookmarkRefId',
            foreignField: '_id',
            as: 'programData',
          },
        },
        // Lookup progress results
        {
          $lookup: {
            from: 'progressResults',
            localField: 'bookmarkRefId',
            foreignField: '_id',
            as: 'progressResultData',
          },
        },
        {
          $project: {
            _id: 1,
            bookmarkGroup: 1,
            createdAt: 1,
            itemData: {
              $cond: {
                if: { $eq: ['$bookmarkGroup', BookmarkGroup.PRODUCT] },
                then: { $arrayElemAt: ['$productData', 0] },
                else: {
                  $cond: {
                    if: { $eq: ['$bookmarkGroup', BookmarkGroup.PROGRAM] },
                    then: { $arrayElemAt: ['$programData', 0] },
                    else: { $arrayElemAt: ['$progressResultData', 0] },
                  },
                },
              },
            },
          },
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
}
