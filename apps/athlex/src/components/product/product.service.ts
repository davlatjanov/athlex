import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Product, Products } from '../../libs/dto/product/product';
import { AuthService } from '../auth/auth.service';
import { ViewService } from '../view/view.service';
import {
  CreateProductInput,
  ProductsInquiry,
} from '../../libs/dto/product/product.input';
import { T } from '../../libs/types/common';
import { ProductStatus } from '../../libs/enums/product.enum';
import { Direction, Message } from '../../libs/enums/common.enum';
import { ProductUpdateInput } from '../../libs/dto/product/product.update';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel('Product') private productModel: Model<Product>,
    private readonly viewService: ViewService,
  ) {}

  public async createProduct(input: CreateProductInput): Promise<Product> {
    try {
      const createdProduct = await this.productModel.create(input);
      return createdProduct;
    } catch (error) {
      console.error('Error creating product:', error);
      throw new Error('Error creating product');
    }
  }

  public async getProducts(input: ProductsInquiry): Promise<Products> {
    const match: T = { productStatus: ProductStatus.ACTIVE };
    const sort: T = {
      [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC,
    };
    const activeProducts = await this.productModel
      .aggregate([
        { $match: match },
        { $sort: sort },
        {
          $facet: {
            list: [
              { $skip: (input.page - 1) * input.limit },
              { $limit: input.limit },
            ],
            metaCounter: [{ $count: 'total' }],
          },
        },
      ])
      .exec();
    if (!activeProducts.length) {
      throw new InternalServerErrorException(Message.NO_DATA_FOUND);
    }

    return activeProducts[0];
  }

  public async updateProduct(input: ProductUpdateInput): Promise<Product> {
    const updatedProduct = await this.productModel
      .findOneAndUpdate(
        {
          _id: input._id,
        },
        input,
        { new: true },
      )
      .lean()
      .exec();

    if (!updatedProduct) {
      throw new InternalServerErrorException(Message.UPDATE_FAILED);
    }

    return updatedProduct;
  }

  public async deleteProduct(input: ObjectId): Promise<Product | null> {
    const deletedProduct = await this.productModel.findOneAndDelete({
      _id: input,
      productStatus: ProductStatus.STOPPED,
    });

    if (!deletedProduct) {
      throw new InternalServerErrorException(Message.REMOVE_FAILED);
    }
    return deletedProduct;
  }
}
