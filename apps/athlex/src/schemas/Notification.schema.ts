import { Schema } from 'mongoose';
import { NotificationType } from '../libs/enums/notification.enum';

const NotificationSchema = new Schema(
  {
    recipientId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Member',
    },

    senderId: {
      type: Schema.Types.ObjectId,
      ref: 'Member',
    },

    notificationType: {
      type: String,
      enum: NotificationType,
      required: true,
    },

    notificationTitle: {
      type: String,
      required: true,
    },

    notificationMessage: {
      type: String,
      required: true,
    },

    notificationLink: {
      type: String,
    },

    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, collection: 'notifications' },
);

NotificationSchema.index({ recipientId: 1, isRead: 1 });
NotificationSchema.index({ recipientId: 1, createdAt: -1 });

export default NotificationSchema;
