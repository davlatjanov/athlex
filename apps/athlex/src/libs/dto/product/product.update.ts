import { Field, InputType, Int } from '@nestjs/graphql';
import { IsIn, IsNotEmpty, IsOptional, Length, Min } from 'class-validator';
import { ProductBrand, ProductType } from '../../enums/product.enum';

@InputType()
export class ProductUpdateInput {
  @IsOptional()
  @Field(() => String)
  _id?: string;

  @IsOptional()
  @Length(3, 12)
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
  productPrice?: number;

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
