import { Module } from '@nestjs/common';
import { TrainingProgramResolver } from './training-program.resolver';
import { TrainingProgramService } from './training-program.service';
import { MongooseModule } from '@nestjs/mongoose';
import TrainingProgramSchema from '../../schemas/TrainingProgram.schema';
import { AuthModule } from '../auth/auth.module';
import { ViewModule } from '../view/view.module';
import { MemberModule } from '../member/member.module';
import { NotificationModule } from '../notification/notification.module';
import ProgramEnrollmentSchema from '../../schemas/ProgramEnrollment.schema';
import OrderSchema from '../../schemas/Order.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Program',
        schema: TrainingProgramSchema,
      },
      { name: 'ProgramEnrollment', schema: ProgramEnrollmentSchema },
      { name: 'Order', schema: OrderSchema },
    ]),
    AuthModule,
    ViewModule,
    MemberModule,
    NotificationModule,
  ],
  providers: [TrainingProgramResolver, TrainingProgramService],
  exports: [TrainingProgramService],
})
export class TrainingProgramModule {}
