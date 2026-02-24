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
import { ProductUpdateInput } from '../../libs/dto/product/product.update';

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

  @UseGuards(WithoutGuard)
  @Query(() => Product)
  public async getOneProduct(
    @Args('productId') id: string,
    @AuthMember('_id') memberId: ObjectId,
  ): Promise<Product | null> {
    console.log('QUERY getOneProduct');
    const productId = shapeIntoMongoObjectId(id);
    return await this.productService.getOneProduct(productId, memberId);
  }
  @UseGuards(RolesGuard)
  @Roles(MemberType.ADMIN)
  @Mutation(() => Product)
  public async updateProduct(
    @Args('input') input: ProductUpdateInput,
  ): Promise<Product> {
    console.log('Mutation updateProduct');

    return await this.productService.updateProduct(input);
  }

  @UseGuards(RolesGuard)
  @Roles(MemberType.ADMIN)
  @Mutation(() => Product)
  public async deleteProduct(
    @Args('productId') productId: string,
  ): Promise<Product | null> {
    console.log('Mutation deteleProduct');
    const _id = shapeIntoMongoObjectId(productId);
    return await this.productService.deleteProduct(_id);
  }

  @UseGuards(RolesGuard)
  @Roles(MemberType.ADMIN)
  @Query(() => Products)
  public async getAllProductsByAdmin(
    @Args('input') input: ProductsInquiry,
  ): Promise<Products> {
    console.log('QUERY getAllProducts');
    return await this.productService.getAllProductsByAdmin(input);
  }
}
