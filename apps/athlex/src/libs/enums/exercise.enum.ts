import { registerEnumType } from '@nestjs/graphql';

export enum Equipment {
  BENCH = 'BENCH',
  BARBELL = 'BARBELL',
  DUMBBELL = 'DUMBBELL',
  MACHINE = 'MACHINE',
  CABLE = 'CABLE',
  BODYWEIGHT = 'BODYWEIGHT',
  RESISTANCE_BAND = 'RESISTANCE_BAND',
  KETTLEBELL = 'KETTLEBELL',
  MEDICINE_BALL = 'MEDICINE_BALL',
  SMITH_MACHINE = 'SMITH_MACHINE',
  EZ_BAR = 'EZ_BAR',
}

export enum ExerciseLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
}

registerEnumType(Equipment, {
  name: 'Equipment',
});

registerEnumType(ExerciseLevel, {
  name: 'ExerciseLevel',
});
