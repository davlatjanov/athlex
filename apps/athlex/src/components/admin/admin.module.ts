import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminResolver } from './admin.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import MemberSchema from '../../schemas/Member.schema';
import TrainingProgramSchema from '../../schemas/TrainingProgram.schema';
import ProductSchema from '../../schemas/Product.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Member', schema: MemberSchema },
      { name: 'Program', schema: TrainingProgramSchema },
      { name: 'Product', schema: ProductSchema },
    ]),
    AuthModule,
  ],
  providers: [AdminService, AdminResolver],
})
export class AdminModule {}
