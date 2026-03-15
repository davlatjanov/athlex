import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import FeedbackSchema from '../../schemas/Feedback.schema';
import { AuthModule } from '../auth/auth.module';
import { MemberModule } from '../member/member.module';
import { FeedbackResolver } from './feedback.resolver';
import { FeedbackService } from './feedback.service';

import { ProductModule } from '../product/product.module';
import { TrainingProgramModule } from '../training-program/training-program.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Feedback',
        schema: FeedbackSchema,
      },
    ]),
    AuthModule,

    ProductModule, // ✅ Add this
    TrainingProgramModule, // ✅ Add this
    MemberModule,
    NotificationModule,
  ],
  providers: [FeedbackResolver, FeedbackService],
  exports: [FeedbackService],
})
export class FeedbackModule {}
