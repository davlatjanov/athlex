import { Module } from '@nestjs/common';
import { ExerciseResolver } from './exercise.resolver';
import { ExerciseService } from './exercise.service';
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
  providers: [ExerciseResolver, ExerciseService],
})
export class ExerciseModule {}
