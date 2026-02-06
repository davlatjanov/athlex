import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import CommentSchema from '../../schemas/Comment.schema';
import { AuthModule } from '../auth/auth.module';
import { MemberModule } from '../member/member.module';
import { CommentResolver } from './comment.resolver';
import { CommentService } from './comment.service';
import { NotificationModule } from '../notification/notification.module';
import { ProductModule } from '../product/product.module';
import { TrainingProgramModule } from '../training-program/training-program.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Comment',
        schema: CommentSchema,
      },
    ]),
    AuthModule,
    MemberModule,
    NotificationModule, // ✅ Add this
    ProductModule, // ✅ Add this (to get product owner)
    TrainingProgramModule, // ✅ Add this (to get program owner)
  ],
  providers: [CommentResolver, CommentService],
  exports: [CommentService],
})
export class CommentModule {}
