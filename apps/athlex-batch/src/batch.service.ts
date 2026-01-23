import { Injectable } from '@nestjs/common';

@Injectable()
export class AthlexBatchService {
  getHello(): string {
    return 'Hello World!';
  }
}
