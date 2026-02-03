import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import FeedbackSchema from '../../schemas/Feedback.schema';
import { AuthModule } from '../auth/auth.module';
import { MemberModule } from '../member/member.module';
import { FeedbackResolver } from './feedback.resolver';
import { FeedbackService } from './feedback.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Feedback',
        schema: FeedbackSchema,
      },
    ]),
    AuthModule,
    MemberModule,
  ],
  providers: [FeedbackResolver, FeedbackService],
  exports: [FeedbackService],
})
export class FeedbackModule {}
