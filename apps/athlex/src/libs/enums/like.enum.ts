import { registerEnumType } from '@nestjs/graphql';

export enum LikeGroup {
  MEMBER = 'MEMBER',
  PRODUCT = 'PRODUCT',
  PROGRAM = 'PROGRAM',
}
registerEnumType(LikeGroup, {
  name: 'LikeGroup',
});
