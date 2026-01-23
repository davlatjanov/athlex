import { Schema } from 'mongoose';

const TrainingProgramSchema = new Schema(
  {
    programName: {
      type: String,
      required: true,
    },
    programStartDate: {
      type: Date,
      required: true,
    },
    programEndDate: {
      type: Date,
      required: true,
    },
    programMembers: {
      type: Number,
      default: 0,
    },
    programDesc: {
      type: String,
    },
    programViews: {
      type: Number,
      default: 0,
    },
    programLikes: {
      type: Number,
      default: 0,
    },
    memberId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'MEMBER',
    },
  },
  { timestamps: true, collection: 'training_programs' },
);

export default TrainingProgramSchema;
