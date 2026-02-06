// components/ai/ai.module.ts
import { Module } from '@nestjs/common';
import { AIResolver } from './ai.resolver';
import { AIService } from '../../libs/services/ai.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [AIResolver, AIService],
  exports: [AIService],
})
export class AIModule {}
