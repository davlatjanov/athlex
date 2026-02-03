import { Schema } from 'mongoose';
import {
  ProductBrand,
  ProductStatus,
  ProductType,
} from '../libs/enums/product.enum';

const ProductSchema = new Schema(
  {
    productName: {
      type: String,
      required: true,
    },
    productBrand: {
      type: String,
      enum: ProductBrand,
      required: true,
    },
    productStatus: {
      type: String,
      enum: ProductStatus,
      default: ProductStatus.ACTIVE,
    },
    productType: {
      type: String,
      enum: ProductType,
      required: true,
    },
    productPrice: {
      type: Number,
      required: true,
    },
    productStock: {
      type: Number,
      default: 0,
    },
    productImages: {
      type: [String],
      required: true,
      default: [],
    },
    productDesc: {
      type: String,
      default: 'NO DESCRIPTION',
    },
    productViews: {
      type: Number,
      default: 0,
    },
    productLikes: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true, collection: 'products' },
);

// ✅ Added indexes for common queries
ProductSchema.index({ productStatus: 1, productBrand: 1 });
ProductSchema.index({ productStatus: 1, productType: 1 });
ProductSchema.index({ productStatus: 1, productPrice: 1 });

export default ProductSchema;
