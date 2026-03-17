import { Schema } from 'mongoose';
import { ProgressResultStatus } from '../libs/enums/progress-result.enum';

const ProgressResultSchema = new Schema(
  {
    memberId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Member',
    },
    programId: {
      type: Schema.Types.ObjectId,
      required: false,
      ref: 'Program',
    },
    trainerId: {
      type: Schema.Types.ObjectId,
      required: false,
      ref: 'Member',
    },
    images: {
      type: [String],
      default: [],
    },
    content: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ProgressResultStatus,
      default: ProgressResultStatus.ACTIVE,
    },
  },
  { timestamps: true, collection: 'progressResults' },
);

// ✅ Added indexes
ProgressResultSchema.index({ memberId: 1 });
ProgressResultSchema.index({ programId: 1 });
ProgressResultSchema.index({ trainerId: 1 });

export default ProgressResultSchema;
