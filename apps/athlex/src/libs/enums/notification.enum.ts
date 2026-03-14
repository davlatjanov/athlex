import { registerEnumType } from '@nestjs/graphql';

export enum NotificationType {
  NEW_FOLLOWER = 'NEW_FOLLOWER',
  NEW_LIKE = 'NEW_LIKE',
  PROGRAM_JOINED = 'PROGRAM_JOINED',
  FEEDBACK_RECEIVED = 'FEEDBACK_RECEIVED',
  ORDER_UPDATE = 'ORDER_UPDATE',
  COMMENT_REPLY = 'COMMENT_REPLY',
  SYSTEM = 'SYSTEM',
}

registerEnumType(NotificationType, {
  name: 'NotificationType',
});
