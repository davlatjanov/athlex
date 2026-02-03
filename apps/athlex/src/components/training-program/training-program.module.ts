import { Module } from '@nestjs/common';
import { TrainingProgramResolver } from './training-program.resolver';
import { TrainingProgramService } from './training-program.service';
import { MongooseModule } from '@nestjs/mongoose';
import TrainingProgramSchema from '../../schemas/TrainingProgram.schema';
import { AuthModule } from '../auth/auth.module';
import { ViewModule } from '../view/view.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Program',
        schema: TrainingProgramSchema,
      },
    ]),
    AuthModule,
    ViewModule,
  ],
  providers: [TrainingProgramResolver, TrainingProgramService],
})
export class TrainingProgramModule {}
