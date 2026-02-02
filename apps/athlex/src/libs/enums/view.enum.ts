import { registerEnumType } from '@nestjs/graphql';

export enum ViewGroup {
  MEMBER = 'MEMBER',
  PRODUCT = 'PRODUCT',
  PROGRAM = 'PROGRAM',
}
registerEnumType(ViewGroup, {
  name: 'ViewGroup',
});
