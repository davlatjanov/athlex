// libs/enums/bookmark.enum.ts
import { registerEnumType } from '@nestjs/graphql';

export enum BookmarkGroup {
  PRODUCT = 'PRODUCT',
  PROGRAM = 'PROGRAM',
  PROGRESS_RESULT = 'PROGRESS_RESULT',
}

registerEnumType(BookmarkGroup, {
  name: 'BookmarkGroup',
});
