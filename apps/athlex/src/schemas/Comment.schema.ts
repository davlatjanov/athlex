import { Schema } from 'mongoose';
import { CommentGroup, CommentStatus } from '../libs/enums/comment.enum';

const CommentSchema = new Schema(
  {
    commentStatus: {
      type: String,
      enum: CommentStatus,
      required: true,
      default: CommentStatus.ACTIVE,
    },
    commentGroup: {
      type: String,
      enum: CommentGroup,
      required: true,
    },
    commentContent: {
      type: String,
      required: true,
    },
    commentRefId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    memberId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Member', // ✅ Changed from 'members'
    },
  },
  { timestamps: true, collection: 'comments' },
);

CommentSchema.index({ commentGroup: 1, commentRefId: 1 });
CommentSchema.index({ memberId: 1 });

export default CommentSchema;
