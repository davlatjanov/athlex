import { Field, InputType, Int } from '@nestjs/graphql';
import { IsIn, IsNotEmpty, IsOptional, Length, Min } from 'class-validator';
import { ProductBrand, ProductType } from '../../enums/product.enum';
import { availableProductSorts } from '../../config';
import { Direction } from '../../enums/common.enum';

@InputType()
export class CreateProductInput {
  @IsNotEmpty()
  @Length(3, 12)
  @Field(() => String)
  productName: string;

  @IsNotEmpty()
  @Field(() => ProductBrand)
  productBrand: ProductBrand;

  @IsNotEmpty()
  @Field(() => ProductType)
  productType: ProductType;

  @IsNotEmpty()
  @Field(() => Int)
  productPrice: number;

  @IsOptional()
  @Field(() => Int, { nullable: true })
  productStock?: number;

  @IsOptional()
  @Field(() => [String], { nullable: true })
  productImages?: string[];

  @IsOptional()
  @Field(() => String, { nullable: true })
  productDesc?: string;
}

@InputType()
export class ProductSearch {
  @IsOptional()
  @Field(() => String, { nullable: true })
  productName?: string;

  @IsOptional()
  @Field(() => ProductBrand, { nullable: true })
  productBrand?: ProductBrand;

  @IsOptional()
  @Field(() => ProductType, { nullable: true })
  productType?: ProductType;

  @IsOptional()
  @Field(() => Int, { nullable: true })
  minPrice?: number;

  @IsOptional()
  @Field(() => Int, { nullable: true })
  maxPrice?: number;
}

@InputType()
export class ProductsInquiry {
  @IsNotEmpty()
  @Min(1)
  @Field(() => Int)
  page: number;

  @IsNotEmpty()
  @Min(1)
  @Field(() => Int)
  limit: number;

  @IsOptional()
  @IsIn(availableProductSorts)
  @Field(() => String, { nullable: true })
  sort?: string;

  @IsOptional()
  @Field(() => Direction, { nullable: true })
  direction?: Direction;

  @IsOptional()
  @Field(() => ProductSearch, { nullable: true })
  search?: ProductSearch;
}
