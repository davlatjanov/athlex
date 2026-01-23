import { Module } from '@nestjs/common';
import { AthlexBatchController as BatchController } from './batch.controller';
import { AthlexBatchService as BatchService } from './batch.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [BatchController],
  providers: [BatchService],
})
export class BatchModule {}
