import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Member, Members } from '../../libs/dto/member/member';
import { AuthGuard } from '../auth/guards/auth.guard';
import { UseGuards } from '@nestjs/common';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import type { ObjectId } from 'mongoose';
import type { T } from '../../libs/types/common';

import { WithoutGuard } from '../auth/guards/without.guard';
import { shapeIntoMongoObjectId } from '../../libs/config';

import { Message } from '../../libs/enums/common.enum';
import { ProductService } from './product.service';
import {
  CreateProductInput,
  ProductsInquiry,
} from '../../libs/dto/product/product.input';
import { Product, Products } from '../../libs/dto/product/product';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { MemberType } from '../../libs/enums/member.enum';

@Resolver()
export class ProductResolver {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(RolesGuard)
  @Roles(MemberType.ADMIN)
  @Mutation(() => Product)
  public async createProduct(
    @Args('input') input: CreateProductInput,
  ): Promise<Product> {
    console.log('Mutation createProduct');
    return await this.productService.createProduct(input);
  }
  @UseGuards(WithoutGuard)
  @Query(() => Products)
  public async getProducts(
    @Args('input') input: ProductsInquiry,
  ): Promise<Products> {
    console.log('QUERY getProducts');
    return await this.productService.getProducts(input);
  }
}
