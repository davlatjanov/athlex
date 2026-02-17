import { registerEnumType } from '@nestjs/graphql';

export enum ProgramType {
  MASS_GAIN = 'MASS_GAIN',
  WEIGHT_LOSS = 'WEIGHT_LOSS',
  STRENGTH = 'STRENGTH',
  CARDIO = 'CARDIO',
  YOGA = 'YOGA',
  FUNCTIONAL = 'FUNCTIONAL',
  REHABILITATION = 'REHABILITATION',
  MOBILITY = 'MOBILITY',
  BEGINNERS = 'BEGINNERS',
  ADVANCED = 'ADVANCED',
}

export enum ProgramLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
}

export enum ProgramStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED',
}

registerEnumType(ProgramType, {
  name: 'ProgramType',
});

registerEnumType(ProgramLevel, {
  name: 'ProgramLevel',
});

registerEnumType(ProgramStatus, {
  name: 'ProgramStatus',
});
