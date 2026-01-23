import { registerEnumType } from '@nestjs/graphql';

export enum ProductType {
  SUPPLEMENT = 'SUPPLEMENT',
  EQUIPMENT = 'EQUIPMENT',
  WEARABLE = 'WEARABLE',
  ACCESSORY = 'ACCESSORY',
  DRINK = 'DRINK',
}

export enum ProductStatus {
  ACTIVE = 'ACTIVE',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
  DISCONTINUED = 'DISCONTINUED',
}

export enum ProductBrand {
  NONE = 'NONE',
  OPTIMUM = 'OPTIMUM',
  MUSCLETECH = 'MUSCLETECH',
  NUTREX = 'NUTREX',
  MYPROTEIN = 'MYPROTEIN',
  NIKE = 'NIKE',
  ADIDAS = 'ADIDAS',
}

registerEnumType(ProductType, {
  name: 'ProductType',
  description: 'The type of the product',
});

registerEnumType(ProductStatus, {
  name: 'ProductStatus',
  description: 'The status of the product',
});

registerEnumType(ProductBrand, {
  name: 'ProductBrand',
  description: 'The brand of the product',
});
