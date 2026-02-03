import { registerEnumType } from '@nestjs/graphql';

export enum CommentStatus {
  ACTIVE = 'ACTIVE',
  HIDDEN = 'HIDDEN',
  DELETED = 'DELETED',
}

export enum CommentGroup {
  PRODUCT = 'PRODUCT',
  TRAINING_PROGRAM = 'PROGRAM',
  TRAINER = 'TRAINER',
}

registerEnumType(CommentStatus, {
  name: 'CommentStatus',
});

registerEnumType(CommentGroup, {
  name: 'CommentGroup',
});
