import { Module } from '@nestjs/common';
import { TrainingProgramResolver } from './training-program.resolver';
import { TrainingProgramService } from './training-program.service';

@Module({
  providers: [TrainingProgramResolver, TrainingProgramService]
})
export class TrainingProgramModule {}
