import { Schema } from 'mongoose';
import { ProgressResultStatus } from '../libs/enums/progress-result.enum';

const ProgressResultSchema = new Schema(
  {
    memberId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Member',
    },

    trainingProgramRefId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'TrainingProgram',
    },

    trainerId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Member',
    },

    images: {
      type: [String],
      required: true, // before / after
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
  {
    timestamps: true,
    collection: 'progressResults',
  },
);

export default ProgressResultSchema;
