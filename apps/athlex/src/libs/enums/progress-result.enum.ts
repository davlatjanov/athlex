import { registerEnumType } from '@nestjs/graphql';

// libs/enums/progress-result.enum.ts
export enum ProgressResultStatus {
  ACTIVE = 'ACTIVE',
  DELETED = 'DELETED',
}

registerEnumType(ProgressResultStatus, {
  name: 'ProgressResultStatus',
});
