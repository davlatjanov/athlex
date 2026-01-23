import { Schema } from 'mongoose';

const TrainingSessionsSchema = new Schema(
  {
    trainingProgramRefId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'TrainingProgram',
    },
    trainerRefId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'MEMBER',
    },
    studentRefId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'MEMBER',
    },
  },
  { timestamps: true, collection: 'training_sessions' },
);

export default TrainingSessionsSchema;
