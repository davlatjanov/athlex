import { Schema } from 'mongoose';
import {
  ProgramLevel,
  ProgramStatus,
  ProgramType,
} from '../libs/enums/training-program.enum';

const TrainingProgramSchema = new Schema(
  {
    // Basic Info
    programName: {
      type: String,
      required: true,
    },
    programDesc: {
      type: String,
      required: true,
    },
    programImages: {
      type: [String],
      required: true,
      default: [],
    },
    programVideo: {
      type: String, // Intro/promo video URL
    },

    // Classification
    programType: {
      type: String,
      enum: Object.values(ProgramType),
      required: true,
    },
    programLevel: {
      type: String,
      enum: Object.values(ProgramLevel),
      required: true,
    },
    programStatus: {
      type: String,
      enum: Object.values(ProgramStatus),
      default: ProgramStatus.ACTIVE,
    },

    // Pricing & Duration
    programPrice: {
      type: Number,
      required: true,
    },

    programDuration: {
      type: Number, // Duration in weeks
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

    // Stats
    programViews: {
      type: Number,
      default: 0,
    },
    programLikes: {
      type: Number,
      default: 0,
    },
    programMembers: {
      type: Number,
      default: 0,
    },
    programComments: {
      type: Number,
      default: 0,
    },
    programRank: {
      type: Number,
      default: 0,
    },

    workouts: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Workout',
      },
    ],

    programTags: {
      type: [String],
      default: [],
    },
    targetAudience: {
      type: [String],
      default: [],
    },
    requirements: {
      type: [String],
      default: [],
    },

    memberId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Member',
    },
  },
  { timestamps: true, collection: 'programs' },
);

TrainingProgramSchema.index({ memberId: 1 });
TrainingProgramSchema.index({ programType: 1, programLevel: 1 });
TrainingProgramSchema.index({ programStatus: 1 });
TrainingProgramSchema.index({ programStartDate: 1, programEndDate: 1 });
TrainingProgramSchema.index({ programRank: -1 });
TrainingProgramSchema.index({ programLikes: -1 });
TrainingProgramSchema.index({ createdAt: -1 });
TrainingProgramSchema.index({ programName: 'text', programDesc: 'text' });

export default TrainingProgramSchema;
