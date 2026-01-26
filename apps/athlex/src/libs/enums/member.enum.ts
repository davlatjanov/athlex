import { registerEnumType } from '@nestjs/graphql';

export enum MemberPlan {
  BEGINNER = 'BEGINNER',
  REGULAR = 'REGULAR',
  ADVANCED = 'ADVANCED',
  PRO = 'PRO',
}

registerEnumType(MemberPlan, {
  name: 'MemberPlan',
});

export enum MemberType {
  USER = 'USER',
  ADMIN = 'ADMIN',
  TRAINER = 'TRAINER',
}

registerEnumType(MemberType, {
  name: 'MemberType',
});

export enum MemberStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  BANNED = 'BANNED',
  DELETED = 'DELETED',
}

registerEnumType(MemberStatus, {
  name: 'MemberStatus',
});

export enum MemberAuthType {
  PHONE = 'PHONE',
  EMAIL = 'EMAIL',
}

registerEnumType(MemberAuthType, {
  name: 'MemberAuthType',
});
