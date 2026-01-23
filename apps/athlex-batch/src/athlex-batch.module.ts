import { Module } from '@nestjs/common';
import { AthlexBatchController } from './athlex-batch.controller';
import { AthlexBatchService } from './athlex-batch.service';

@Module({
  imports: [],
  controllers: [AthlexBatchController],
  providers: [AthlexBatchService],
})
export class AthlexBatchModule {}
