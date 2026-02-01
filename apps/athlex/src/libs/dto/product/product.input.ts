import { Field, InputType, Int } from '@nestjs/graphql';
import { IsIn, IsNotEmpty, IsOptional, Length, Min } from 'class-validator';
import { ProductBrand, ProductType } from '../../enums/product.enum';

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
  @Field(() => Int)
  productStock?: number;

  @IsNotEmpty()
  @Field(() => [String])
  productImages?: string[];

  @IsNotEmpty()
  @Field(() => String)
  productDesc?: string;
}
