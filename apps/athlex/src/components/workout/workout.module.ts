import { Module } from '@nestjs/common';
import { WorkoutResolver } from './workout.resolver';
import { WorkoutService } from './workout.service';
import { MongooseModule } from '@nestjs/mongoose';
import TrainingProgramSchema from '../../schemas/TrainingProgram.schema';
import WorkoutSchema from '../../schemas/Workout.schema';
import ExerciseSchema from '../../schemas/Exercise.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Program', schema: TrainingProgramSchema },
      { name: 'Workout', schema: WorkoutSchema },
      { name: 'Exercise', schema: ExerciseSchema },
    ]),
    AuthModule,
  ],
  providers: [WorkoutResolver, WorkoutService],
  exports: [WorkoutService],
})
export class WorkoutModule {}
