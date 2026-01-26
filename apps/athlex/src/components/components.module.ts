import { Module } from '@nestjs/common';
import { MemberModule } from './member/member.module';
import { ProductModule } from './product/product.module';
import { ProgressResultsModule } from './progress-results/progress-results.module';
import { TrainingProgramModule } from './training-program/training-program.module';
import { TrainingSessionsModule } from './training-sessions/training-sessions.module';
import { ViewModule } from './view/view.module';
import { CommentModule } from './comment/comment.module';
import { EventsModule } from './events/events.module';
import { FeedbackModule } from './feedback/feedback.module';
import { FollowModule } from './follow/follow.module';
import { LikeModule } from './like/like.module';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [MemberModule, ProductModule, ProgressResultsModule, TrainingProgramModule, TrainingSessionsModule, ViewModule, CommentModule, EventsModule, FeedbackModule, FollowModule, LikeModule, AuthModule, AdminModule]
})
export class ComponentsModule {}
