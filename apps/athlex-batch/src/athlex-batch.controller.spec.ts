import { Test, TestingModule } from '@nestjs/testing';
import { AthlexBatchController } from './athlex-batch.controller';
import { AthlexBatchService } from './athlex-batch.service';

describe('AthlexBatchController', () => {
  let athlexBatchController: AthlexBatchController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AthlexBatchController],
      providers: [AthlexBatchService],
    }).compile();

    athlexBatchController = app.get<AthlexBatchController>(AthlexBatchController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(athlexBatchController.getHello()).toBe('Hello World!');
    });
  });
});
