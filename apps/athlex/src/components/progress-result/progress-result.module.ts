import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from '../auth/auth.module';
import { MemberModule } from '../member/member.module';
import ProgressResultSchema from '../../schemas/ProgressResults.schema';
import { ProgressResultResolver } from './progress-result.resolver';
import { ProgressResultService } from './progress-result.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'ProgressResult',
        schema: ProgressResultSchema,
      },
    ]),
    AuthModule,
    MemberModule,
  ],
  providers: [ProgressResultResolver, ProgressResultService],
  exports: [ProgressResultService],
})
export class ProgressResultModule {}
