// apps/athlex-batch/src/batch.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { BatchController } from './batch.controller';
import { BatchService } from './batch.service';
import { EmailService } from './email.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URL as string),
    ScheduleModule.forRoot(),
  ],
  controllers: [BatchController],
  providers: [BatchService, EmailService],
})
export class BatchModule {}
