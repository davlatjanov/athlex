import { Schema } from 'mongoose';
import { Equipment, ExerciseLevel } from '../libs/enums/exercise.enum';

const ExerciseSchema = new Schema(
  {
    // Basic Info
    exerciseName: {
      type: String,
      required: true,
    },
    exerciseDesc: {
      type: String,
      required: true,
    },
    exerciseVideo: {
      type: String, // Video URL (Cloudinary)
    },
    exerciseGif: {
      type: String, // GIF URL (for quick preview)
    },
    exerciseImage: {
      type: String, // Thumbnail
    },

    // Muscle Groups
    primaryMuscle: {
      type: String,
      required: true, // Main muscle targeted
    },
    secondaryMuscles: {
      type: [String],
      default: [],
    },

    // Exercise Parameters
    sets: {
      type: Number,
      default: 3,
    },
    reps: {
      type: String, // "8-12" or "10" or "AMRAP"
      default: '10-12',
    },
    restTime: {
      type: Number, // Rest time in seconds
      default: 60,
    },
    tempo: {
      type: String, // e.g., "3-0-1-0" (eccentric-pause-concentric-pause)
    },

    // Instructions
    instructions: {
      type: [String],
      required: true,
    },
    tips: {
      type: [String],
      default: [],
    },

    // Equipment
    equipment: {
      type: [String],
      enum: Object.values(Equipment),
      required: true,
    },

    // Difficulty
    difficulty: {
      type: String,
      enum: Object.values(ExerciseLevel),
      default: ExerciseLevel.INTERMEDIATE,
    },

    // Order in workout
    orderInWorkout: {
      type: Number,
      default: 0,
    },

    // Workout Reference
    workoutId: {
      type: Schema.Types.ObjectId,
      ref: 'Workout',
      required: true,
    },
  },
  { timestamps: true, collection: 'exercises' },
);

// Indexes
ExerciseSchema.index({ workoutId: 1, orderInWorkout: 1 });
ExerciseSchema.index({ primaryMuscle: 1 });
ExerciseSchema.index({ equipment: 1 });

export default ExerciseSchema;
