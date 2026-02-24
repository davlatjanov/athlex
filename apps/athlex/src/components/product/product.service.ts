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
import { ViewGroup } from '../../libs/enums/view.enum';

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
      throw new InternalServerErrorException(Message.CREATE_FAILED);
    }
  }

  public async getProducts(input: ProductsInquiry): Promise<Products> {
    const match: T = { productStatus: ProductStatus.ACTIVE };
    const sort: T = {
      [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC,
    };

    // Search filters
    if (input.search?.productName) {
      match.productName = { $regex: new RegExp(input.search.productName, 'i') };
    }

    if (input.search?.productBrand) {
      match.productBrand = input.search.productBrand;
    }

    if (input.search?.productType) {
      match.productType = input.search.productType;
    }

    // Price range filter
    if (input.search?.minPrice || input.search?.maxPrice) {
      match.productPrice = {};
      if (input.search.minPrice) {
        match.productPrice.$gte = input.search.minPrice;
      }
      if (input.search.maxPrice) {
        match.productPrice.$lte = input.search.maxPrice;
      }
    }

    console.log('match', match);

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

  public async getOneProduct(
    productId: ObjectId,
    memberId: ObjectId,
  ): Promise<Product | null> {
    const search: T = {
      _id: productId,
      productStatus: {
        $in: [ProductStatus.ACTIVE, ProductStatus.OUT_OF_STOCK],
      },
    };
    const targetProduct = await this.productModel.findOne(search).lean().exec();

    if (!targetProduct) {
      throw new InternalServerErrorException(Message.NO_DATA_FOUND);
    }

    if (memberId) {
      const viewInput = {
        memberId: memberId,
        viewRefId: productId,
        viewGroup: ViewGroup.PRODUCT,
      };
      const newView = await this.viewService.recordView(viewInput);

      if (newView) {
        await this.productModel
          .findOneAndUpdate(
            search,
            { $inc: { productViews: 1 } },
            { new: true },
          )
          .exec();
        targetProduct.productViews = (targetProduct.productViews ?? 0) + 1;
      }
    }

    return targetProduct;
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
    const deletedProduct = await this.productModel
      .findOneAndDelete({
        _id: input,
      })
      .exec();

    if (!deletedProduct) {
      throw new InternalServerErrorException(Message.REMOVE_FAILED);
    }
    return deletedProduct;
  }

  public async getAllProductsByAdmin(
    input: ProductsInquiry,
  ): Promise<Products> {
    const match: T = {}; // No status filter - get ALL products
    const sort: T = {
      [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC,
    };

    // Search filters
    if (input.search?.productName) {
      match.productName = { $regex: new RegExp(input.search.productName, 'i') };
    }

    if (input.search?.productBrand) {
      match.productBrand = input.search.productBrand;
    }

    if (input.search?.productType) {
      match.productType = input.search.productType;
    }

    // Price range filter
    if (input.search?.minPrice || input.search?.maxPrice) {
      match.productPrice = {};
      if (input.search.minPrice) {
        match.productPrice.$gte = input.search.minPrice;
      }
      if (input.search.maxPrice) {
        match.productPrice.$lte = input.search.maxPrice;
      }
    }

    console.log('match', match);

    const allProducts = await this.productModel
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

    if (!allProducts.length) {
      throw new InternalServerErrorException(Message.NO_DATA_FOUND);
    }

    return allProducts[0];
  }

  public async updateProductByLike(
    productId: ObjectId,
    increment: number,
  ): Promise<void> {
    await this.productModel
      .findByIdAndUpdate(productId, {
        $inc: { productLikes: increment },
      })
      .exec();
  }
}
