import { Module } from '@nestjs/common';
import { MemberModule } from './member/member.module';
import { ProductModule } from './product/product.module';
import { ProgressResultModule } from './progress-result/progress-result.module';
import { TrainingProgramModule } from './training-program/training-program.module';

import { ViewModule } from './view/view.module';
import { CommentModule } from './comment/comment.module';

import { FeedbackModule } from './feedback/feedback.module';
import { FollowModule } from './follow/follow.module';
import { LikeModule } from './like/like.module';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { BookmarkModule } from './bookmark/bookmark.module';

@Module({
  imports: [
    MemberModule,
    ProductModule,
    ProgressResultModule,
    TrainingProgramModule,
    ViewModule,
    CommentModule,
    FeedbackModule,
    FollowModule,
    LikeModule,
    AuthModule,
    AdminModule,
    BookmarkModule,
  ],
})
export class ComponentsModule {}
