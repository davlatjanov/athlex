import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import mongoose from 'mongoose';
import { OrderStatus } from '../../enums/order.enum';
import { TotalCounter } from '../member/member';

@ObjectType()
export class ShippingAddress {
  @Field(() => String, { nullable: true })
  street?: string;

  @Field(() => String, { nullable: true })
  city?: string;

  @Field(() => String, { nullable: true })
  state?: string;

  @Field(() => String, { nullable: true })
  zipCode?: string;

  @Field(() => String, { nullable: true })
  country?: string;
}

@ObjectType()
export class OrderItem {
  @Field(() => String)
  productId: mongoose.ObjectId;

  @Field(() => String)
  productName: string;

  @Field(() => Float)
  productPrice: number;

  @Field(() => Int)
  quantity: number;
}

@ObjectType()
export class Order {
  @Field(() => String)
  _id: mongoose.ObjectId;

  @Field(() => String)
  memberId: mongoose.ObjectId;

  @Field(() => [OrderItem])
  items: OrderItem[];

  @Field(() => Float)
  totalAmount: number;

  @Field(() => OrderStatus)
  orderStatus: OrderStatus;

  @Field(() => ShippingAddress, { nullable: true })
  shippingAddress?: ShippingAddress;

  @Field(() => String, { nullable: true })
  paymentMethod?: string;

  @Field(() => String, { nullable: true })
  paymentId?: string;

  @Field(() => String, { nullable: true })
  notes?: string;

  @Field(() => Date)
  createdAt?: Date;

  @Field(() => Date)
  updatedAt?: Date;
}

@ObjectType()
export class Orders {
  @Field(() => [Order])
  list: Order[];

  @Field(() => [TotalCounter], { nullable: true })
  metaCounter: TotalCounter[];
}
