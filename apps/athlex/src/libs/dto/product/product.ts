import { Field, Int, ObjectType } from '@nestjs/graphql';
import mongoose from 'mongoose';
import {
  ProductBrand,
  ProductStatus,
  ProductType,
} from '../../enums/product.enum';
import { TotalCounter } from '../member/member';

@ObjectType()
export class Product {
  @Field(() => String)
  _id: mongoose.ObjectId;

  @Field(() => String)
  productName: string;

  @Field(() => ProductBrand)
  productBrand: ProductBrand;

  @Field(() => ProductStatus)
  productStatus: ProductStatus;

  @Field(() => ProductType)
  productType: ProductType;

  @Field(() => Int)
  productPrice: number;

  @Field(() => Int)
  productStock: number;

  @Field(() => [String])
  productImages: string[];

  @Field(() => String)
  productDesc: string;

  @Field(() => Int)
  productViews: number;

  @Field(() => Int)
  productLikes: number;

  @Field(() => Date)
  createdAt?: Date;

  @Field(() => Date)
  updatedAt?: Date;
}

@ObjectType()
export class Products {
  @Field(() => [Product])
  list: Product[];

  @Field(() => [TotalCounter], { nullable: true })
  metaCounter: TotalCounter[];
}
