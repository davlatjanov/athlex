// apps/athlex-batch/src/batch.controller.ts
import { Controller, Get } from '@nestjs/common';
import { BatchService } from './batch.service';

@Controller()
export class BatchController {
  constructor(private readonly batchService: BatchService) {}

  @Get()
  getHealth(): object {
    return {
      status: 'running',
      message: 'Athlex Batch Server is running',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    };
  }

  @Get('jobs')
  getJobs(): object {
    return this.batchService.getJobsStatus();
  }

  @Get('stats')
  getStats(): object {
    return this.batchService.getStats();
  }
}
