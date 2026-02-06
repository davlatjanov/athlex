// schemas/Notification.schema.ts
import { Schema } from 'mongoose';

const NotificationSchema = new Schema(
  {
    notificationType: {
      type: String,
      enum: [
        'LIKE',
        'FOLLOW',
        'COMMENT',
        'FEEDBACK',
        'PROGRAM_ENROLL',
        'ADMIN_MESSAGE',
      ],
      required: true,
    },
    notificationStatus: {
      type: String,
      enum: ['WAIT', 'READ'],
      default: 'WAIT',
    },
    notificationGroup: {
      type: String,
      enum: ['MEMBER', 'PRODUCT', 'PROGRAM', 'ARTICLE'],
      required: true,
    },
    notificationTitle: {
      type: String,
      required: true,
    },
    notificationDesc: {
      type: String,
    },
    authorId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Member',
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Member',
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
    },
    programId: {
      type: Schema.Types.ObjectId,
      ref: 'Program',
    },
  },
  { timestamps: true, collection: 'notifications' },
);

NotificationSchema.index({ receiverId: 1, notificationStatus: 1 });
NotificationSchema.index({ receiverId: 1, createdAt: -1 });

export default NotificationSchema;
