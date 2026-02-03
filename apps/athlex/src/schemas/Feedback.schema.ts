import { Schema } from 'mongoose';
import { FeedbackGroup, FeedbackScale } from '../libs/enums/feedback.enum';

const FeedbackSchema = new Schema(
  {
    feedbackContent: {
      type: String,
      required: true,
    },
    feedbackScale: {
      type: Number,
      enum: FeedbackScale,
      required: true,
    },
    feedbackGroup: {
      type: String,
      enum: FeedbackGroup,
      required: true,
    },
    feedbackRefId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    memberId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Member', // ✅ Changed from 'members'
    },
  },
  { timestamps: true, collection: 'feedbacks' },
);

FeedbackSchema.index(
  { memberId: 1, feedbackGroup: 1, feedbackRefId: 1 },
  { unique: true },
);

export default FeedbackSchema;
