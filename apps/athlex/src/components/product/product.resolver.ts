import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Member, Members } from '../../libs/dto/member/member';
import { AuthGuard } from '../auth/guards/auth.guard';
import { UseGuards } from '@nestjs/common';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import type { ObjectId } from 'mongoose';
import type { T } from '../../libs/types/common';
import { MemberUpdate } from '../../libs/dto/member/member.update';
import { WithoutGuard } from '../auth/guards/without.guard';
import { shapeIntoMongoObjectId } from '../../libs/config';

import { GraphQLUpload, FileUpload } from 'graphql-upload';
import { uploadToCloudinary } from '../../libs/utils/cloudinary-uploader';
import { Message } from '../../libs/enums/common.enum';
import { ProductService } from './product.service';

@Resolver()
export class ProductResolver {
  constructor(private readonly productService: ProductService) {}

  //   public async createProduct(
  //     @Args('input') input: CreateProductInput,
  //   ): Promise<Product> {
  //     return this.productService.create(input);
  //   }
}
