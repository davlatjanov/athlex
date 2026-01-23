import { NestFactory } from '@nestjs/core';
import { AthlexBatchModule } from './athlex-batch.module';

async function bootstrap() {
  const app = await NestFactory.create(AthlexBatchModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
