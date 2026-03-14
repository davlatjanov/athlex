import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import type { ObjectId } from 'mongoose';
import { MemberType } from '../../libs/enums/member.enum';
import { OrderService } from './order.service';
import { Order, Orders } from '../../libs/dto/order/order';
import {
  CreateOrderInput,
  OrdersInquiry,
  OrderUpdateInput,
} from '../../libs/dto/order/order.input';

@Resolver()
export class OrderResolver {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(AuthGuard)
  @Mutation(() => Order)
  public async createOrder(
    @Args('input') input: CreateOrderInput,
    @AuthMember('_id') memberId: ObjectId,
  ): Promise<Order> {
    console.log('Mutation: createOrder');
    return await this.orderService.createOrder(memberId, input);
  }

  @UseGuards(AuthGuard)
  @Query(() => Orders)
  public async getMyOrders(
    @Args('input') input: OrdersInquiry,
    @AuthMember('_id') memberId: ObjectId,
  ): Promise<Orders> {
    console.log('Query: getMyOrders');
    return await this.orderService.getMyOrders(memberId, input);
  }

  @UseGuards(AuthGuard)
  @Query(() => Order)
  public async getOneOrder(
    @Args('orderId') orderId: string,
    @AuthMember('_id') memberId: ObjectId,
  ): Promise<Order> {
    console.log('Query: getOneOrder');
    return await this.orderService.getOneOrder(memberId, orderId);
  }

  @UseGuards(RolesGuard)
  @Roles(MemberType.ADMIN)
  @Mutation(() => Order)
  public async updateOrderStatus(
    @Args('input') input: OrderUpdateInput,
  ): Promise<Order> {
    console.log('Mutation: updateOrderStatus');
    return await this.orderService.updateOrderStatus(input);
  }

  @UseGuards(RolesGuard)
  @Roles(MemberType.ADMIN)
  @Query(() => Orders)
  public async getAllOrdersByAdmin(
    @Args('input') input: OrdersInquiry,
  ): Promise<Orders> {
    console.log('Query: getAllOrdersByAdmin');
    return await this.orderService.getAllOrdersByAdmin(input);
  }
}
