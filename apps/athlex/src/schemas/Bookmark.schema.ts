// schemas/Bookmark.schema.ts
import { Schema } from 'mongoose';
import { BookmarkGroup } from '../libs/enums/bookmark.enum';

const BookmarkSchema = new Schema(
  {
    memberId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Member',
    },
    bookmarkRefId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    bookmarkGroup: {
      type: String,
      enum: BookmarkGroup,
      required: true,
    },
  },
  { timestamps: true, collection: 'bookmarks' },
);

// Unique: one bookmark per user per item
BookmarkSchema.index({ memberId: 1, bookmarkRefId: 1 }, { unique: true });

export default BookmarkSchema;
