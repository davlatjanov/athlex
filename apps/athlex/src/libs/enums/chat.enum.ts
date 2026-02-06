// libs/enums/chat.enum.ts
import { registerEnumType } from '@nestjs/graphql';

export enum MessageType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  FILE = 'FILE',
}

export enum MessageStatus {
  SENT = 'SENT',
  DELIVERED = 'DELIVERED',
  READ = 'READ',
}

registerEnumType(MessageType, {
  name: 'MessageType',
});

registerEnumType(MessageStatus, {
  name: 'MessageStatus',
});
