// components/ai/ai.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AIResolver } from './ai.resolver';
import { AIService } from '../../libs/services/ai.service';
import { AuthModule } from '../auth/auth.module';
import ConversationSchema from '../../schemas/Conversation.schema';
import TrainingProgramSchema from '../../schemas/TrainingProgram.schema';
import ProgramEnrollmentSchema from '../../schemas/ProgramEnrollment.schema';
import ProgressResultSchema from '../../schemas/ProgressResults.schema';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: 'Conversation', schema: ConversationSchema },
      { name: 'Program', schema: TrainingProgramSchema },
      { name: 'ProgramEnrollment', schema: ProgramEnrollmentSchema },
      { name: 'ProgressResult', schema: ProgressResultSchema },
    ]),
  ],
  providers: [AIResolver, AIService],
  exports: [AIService],
})
export class AIModule {}
