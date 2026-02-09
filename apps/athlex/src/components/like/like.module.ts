import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LikeResolver } from './like.resolver';
import { LikeService } from './like.service';
import LikeSchema from '../../schemas/Like.schema';
import { AuthModule } from '../auth/auth.module';
import { MemberModule } from '../member/member.module';
import { ProductModule } from '../product/product.module';
import { TrainingProgramModule } from '../training-program/training-program.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Like',
        schema: LikeSchema,
      },
    ]),
    AuthModule,
    MemberModule,
    ProductModule,
    TrainingProgramModule,
  ],
  providers: [LikeResolver, LikeService],
  exports: [LikeService],
})
export class LikeModule {}
