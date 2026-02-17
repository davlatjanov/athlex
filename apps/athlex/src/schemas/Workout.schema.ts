import { Schema } from 'mongoose';
import { BodyPart } from '../libs/enums/workout.enum';

const WorkoutSchema = new Schema(
  {
    // Basic Info
    workoutName: {
      type: String,
      required: true,
    },
    workoutDesc: {
      type: String,
    },
    workoutDay: {
      type: Number,
      required: true, // 1, 2, 3, etc.
    },
    workoutDuration: {
      type: Number,
      default: 60,
    },

    bodyParts: {
      type: [String],
      enum: Object.values(BodyPart),
      required: true,
    },

    // Rest Day
    isRestDay: {
      type: Boolean,
      default: false,
    },

    // Exercises in this workout
    exercises: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Exercise',
      },
    ],

    // Program Reference
    programId: {
      type: Schema.Types.ObjectId,
      ref: 'Program',
      required: true,
    },
  },
  { timestamps: true, collection: 'workouts' },
);

// Indexes
WorkoutSchema.index({ programId: 1, workoutDay: 1 });
WorkoutSchema.index({ bodyParts: 1 });

export default WorkoutSchema;
