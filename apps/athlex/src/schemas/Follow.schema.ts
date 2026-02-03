import { Schema } from 'mongoose';

const FollowSchema = new Schema(
  {
    followingId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Member', // ✅ Added ref
    },
    followerId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Member', // ✅ Added ref
    },
  },
  { timestamps: true, collection: 'follows' }, // ✅ Added collection name
);

FollowSchema.index({ followingId: 1, followerId: 1 }, { unique: true });

export default FollowSchema;
