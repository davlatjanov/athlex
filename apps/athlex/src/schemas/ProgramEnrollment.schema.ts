import { Schema } from 'mongoose';

const ProgramEnrollmentSchema = new Schema(
  {
    memberId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Member', // ✅ Changed from 'MEMBER'
    },
    programId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Program',
    },
    enrolledAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true, collection: 'programEnrollments' },
);

ProgramEnrollmentSchema.index({ memberId: 1, programId: 1 }, { unique: true });

export default ProgramEnrollmentSchema;
