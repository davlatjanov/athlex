import { Schema } from 'mongoose';

const EventSchema = new Schema(
  {
    memberId: {
      type: Schema.Types.ObjectId,
      required: true,
    },

    eventDate: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true },
);

EventSchema.index({ memberId: 1, eventDate: 1 });

export default EventSchema;
