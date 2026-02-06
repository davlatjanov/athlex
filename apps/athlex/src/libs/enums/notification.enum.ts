// libs/enums/notification.enum.ts
import { registerEnumType } from '@nestjs/graphql';

export enum NotificationType {
  LIKE = 'LIKE',
  FOLLOW = 'FOLLOW',
  COMMENT = 'COMMENT',
  FEEDBACK = 'FEEDBACK',
  PROGRAM_ENROLL = 'PROGRAM_ENROLL',
  ADMIN_MESSAGE = 'ADMIN_MESSAGE',
}

export enum NotificationStatus {
  WAIT = 'WAIT',
  READ = 'READ',
}

export enum NotificationGroup {
  MEMBER = 'MEMBER',
  PRODUCT = 'PRODUCT',
  PROGRAM = 'PROGRAM',
  ARTICLE = 'ARTICLE',
}

registerEnumType(NotificationType, {
  name: 'NotificationType',
});

registerEnumType(NotificationStatus, {
  name: 'NotificationStatus',
});

registerEnumType(NotificationGroup, {
  name: 'NotificationGroup',
});
