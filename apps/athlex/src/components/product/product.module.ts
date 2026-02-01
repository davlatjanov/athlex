import { Module } from '@nestjs/common';
import { ProductResolver } from './product.resolver';
import { ProductService } from './product.service';
import { MongooseModule } from '@nestjs/mongoose';
import ProductSchema from '../../schemas/Product.schema';
import { AuthModule } from '../auth/auth.module';
import { ViewModule } from '../view/view.module';
import { Member } from '../../libs/dto/member/member';
import { MemberModule } from '../member/member.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Product',
        schema: ProductSchema,
      },
    ]),
    AuthModule,
    ViewModule,
  ],
  providers: [ProductResolver, ProductService],
})
export class ProductModule {}
