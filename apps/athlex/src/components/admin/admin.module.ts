import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminResolver } from './admin.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import MemberSchema from '../../schemas/Member.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Member', schema: MemberSchema }]),
  ],
  providers: [AdminService, AdminResolver],
})
export class AdminModule {}
