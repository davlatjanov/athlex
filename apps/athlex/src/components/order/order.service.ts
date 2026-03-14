import {
  Injectable,
  InternalServerErrorException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Order, Orders } from '../../libs/dto/order/order';
import {
  CreateOrderInput,
  OrdersInquiry,
  OrderUpdateInput,
} from '../../libs/dto/order/order.input';
import { Direction, Message } from '../../libs/enums/common.enum';
import { T } from '../../libs/types/common';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel('Order') private orderModel: Model<Order>,
    @InjectModel('Product') private productModel: Model<any>,
  ) {}

  public async createOrder(
    memberId: ObjectId,
    input: CreateOrderInput,
  ): Promise<Order> {
    // Calculate total from items
    let totalAmount = 0;
    for (const item of input.items) {
      totalAmount += item.productPrice * item.quantity;

      // Optionally validate stock
      const product = await this.productModel.findById(item.productId).exec();
      if (!product) {
        throw new InternalServerErrorException(
          `Product ${item.productId} not found`,
        );
      }
      if (product.productStock < item.quantity) {
        throw new InternalServerErrorException(
          `Insufficient stock for ${product.productName}`,
        );
      }
    }

    const order = await this.orderModel.create({
      memberId,
      items: input.items,
      totalAmount,
      shippingAddress: input.shippingAddress,
      paymentMethod: input.paymentMethod ?? 'CARD',
      notes: input.notes,
    });

    if (!order) {
      throw new InternalServerErrorException(Message.CREATE_FAILED);
    }

    // Decrease product stock
    for (const item of input.items) {
      await this.productModel.findByIdAndUpdate(item.productId, {
        $inc: { productStock: -item.quantity },
      });
    }

    return order;
  }

  public async getMyOrders(
    memberId: ObjectId,
    input: OrdersInquiry,
  ): Promise<Orders> {
    const match: T = { memberId };

    if (input.orderStatus) {
      match.orderStatus = input.orderStatus;
    }

    const sort: T = {
      [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC,
    };

    const page = input.page ?? 1;
    const limit = input.limit ?? 10;

    const result = await this.orderModel
      .aggregate([
        { $match: match },
        { $sort: sort },
        {
          $facet: {
            list: [{ $skip: (page - 1) * limit }, { $limit: limit }],
            metaCounter: [{ $count: 'total' }],
          },
        },
      ])
      .exec();

    if (!result.length) {
      throw new InternalServerErrorException(Message.NO_DATA_FOUND);
    }
    return result[0];
  }

  public async getOneOrder(
    memberId: ObjectId,
    orderId: string,
  ): Promise<Order> {
    const order = await this.orderModel.findById(orderId).exec();
    if (!order) {
      throw new InternalServerErrorException(Message.NO_DATA_FOUND);
    }

    // Verify ownership (unless admin, handled at resolver level)
    if (order.memberId.toString() !== memberId.toString()) {
      throw new ForbiddenException(Message.NOT_ALLOWED);
    }

    return order;
  }

  public async updateOrderStatus(input: OrderUpdateInput): Promise<Order> {
    const update: T = {};
    if (input.orderStatus) update.orderStatus = input.orderStatus;
    if (input.paymentId) update.paymentId = input.paymentId;

    const result = await this.orderModel
      .findByIdAndUpdate(input.orderId, update, { new: true })
      .exec();

    if (!result) {
      throw new InternalServerErrorException(Message.UPDATE_FAILED);
    }

    // If cancelled, restore stock
    if (input.orderStatus === 'CANCELLED' || input.orderStatus === 'REFUNDED') {
      for (const item of result.items) {
        await this.productModel.findByIdAndUpdate(item.productId, {
          $inc: { productStock: item.quantity },
        });
      }
    }

    return result;
  }

  public async getAllOrdersByAdmin(input: OrdersInquiry): Promise<Orders> {
    const match: T = {};

    if (input.orderStatus) {
      match.orderStatus = input.orderStatus;
    }

    const sort: T = {
      [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC,
    };

    const page = input.page ?? 1;
    const limit = input.limit ?? 10;

    const result = await this.orderModel
      .aggregate([
        { $match: match },
        { $sort: sort },
        {
          $facet: {
            list: [
              { $skip: (page - 1) * limit },
              { $limit: limit },
              {
                $lookup: {
                  from: 'members',
                  localField: 'memberId',
                  foreignField: '_id',
                  as: 'memberData',
                },
              },
              {
                $unwind: {
                  path: '$memberData',
                  preserveNullAndEmptyArrays: true,
                },
              },
            ],
            metaCounter: [{ $count: 'total' }],
          },
        },
      ])
      .exec();

    if (!result.length) {
      throw new InternalServerErrorException(Message.NO_DATA_FOUND);
    }
    return result[0];
  }
}
