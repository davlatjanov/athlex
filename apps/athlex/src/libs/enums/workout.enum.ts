import { registerEnumType } from '@nestjs/graphql';

export enum BodyPart {
  CHEST = 'CHEST',
  BACK = 'BACK',
  SHOULDERS = 'SHOULDERS',
  BICEPS = 'BICEPS',
  TRICEPS = 'TRICEPS',
  FOREARMS = 'FOREARMS',
  QUADS = 'QUADS',
  HAMSTRINGS = 'HAMSTRINGS',
  GLUTES = 'GLUTES',
  CALVES = 'CALVES',
  ABS = 'ABS',
  OBLIQUES = 'OBLIQUES',
  FULL_BODY = 'FULL_BODY',
}

registerEnumType(BodyPart, {
  name: 'BodyPart',
});
