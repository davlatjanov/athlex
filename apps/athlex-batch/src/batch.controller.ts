import { Controller, Get } from '@nestjs/common';
import { AthlexBatchService } from './batch.service';

@Controller()
export class AthlexBatchController {
  constructor(private readonly athlexBatchService: AthlexBatchService) {}

  @Get()
  getHello(): string {
    return this.athlexBatchService.getHello();
  }
}
