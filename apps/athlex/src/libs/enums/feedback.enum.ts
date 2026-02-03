import { registerEnumType } from '@nestjs/graphql';

export enum FeedbackScale {
  ONE = 1,
  TWO = 2,
  THREE = 3,
  FOUR = 4,
  FIVE = 5,
}

export enum FeedbackGroup {
  PRODUCT = 'PRODUCT',
  TRAINING_PROGRAM = 'PROGRAM',
  TRAINER = 'TRAINER',
}

registerEnumType(FeedbackScale, {
  name: 'FeedbackScale',
});

registerEnumType(FeedbackGroup, {
  name: 'FeedbackGroup',
});
