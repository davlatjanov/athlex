import { Field, Float, InputType, Int } from '@nestjs/graphql';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { OrderStatus } from '../../enums/order.enum';
import { Type } from 'class-transformer';
import { Direction } from '../../enums/common.enum';

@InputType()
export class OrderItemInput {
  @IsNotEmpty()
  @Field(() => String)
  productId: string;

  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  productName: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Field(() => Float)
  productPrice: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Field(() => Int)
  quantity: number;
}

@InputType()
export class ShippingAddressInput {
  @IsOptional()
  @Field(() => String, { nullable: true })
  street?: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  city?: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  state?: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  zipCode?: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  country?: string;
}

@InputType()
export class CreateOrderInput {
  @IsNotEmpty()
  @IsArray()
  @Field(() => [OrderItemInput])
  items: OrderItemInput[];

  @IsOptional()
  @Field(() => ShippingAddressInput, { nullable: true })
  shippingAddress?: ShippingAddressInput;

  @IsOptional()
  @Field(() => String, { nullable: true })
  paymentMethod?: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  notes?: string;
}

@InputType()
export class OrdersInquiry {
  @IsOptional()
  @Field(() => Int, { nullable: true })
  page?: number;

  @IsOptional()
  @Field(() => Int, { nullable: true })
  limit?: number;

  @IsOptional()
  @IsEnum(OrderStatus)
  @Field(() => OrderStatus, { nullable: true })
  orderStatus?: OrderStatus;

  @IsOptional()
  @Field(() => String, { nullable: true })
  sort?: string;

  @IsOptional()
  @IsEnum(Direction)
  @Field(() => Direction, { nullable: true })
  direction?: Direction;
}

@InputType()
export class OrderUpdateInput {
  @IsNotEmpty()
  @Field(() => String)
  orderId: string;

  @IsOptional()
  @IsEnum(OrderStatus)
  @Field(() => OrderStatus, { nullable: true })
  orderStatus?: OrderStatus;

  @IsOptional()
  @Field(() => String, { nullable: true })
  paymentId?: string;
}
