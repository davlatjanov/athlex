import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import mongoose from 'mongoose';
import {
  MemberAuthType,
  MemberStatus,
  MemberType,
} from '../../enums/member.enum';

@ObjectType()
export class MemberSocial {
  @Field(() => String, { nullable: true })
  instagram?: string;

  @Field(() => String, { nullable: true })
  twitter?: string;

  @Field(() => String, { nullable: true })
  youtube?: string;
}

@ObjectType()
export class Member {
  @Field(() => String)
  _id?: mongoose.ObjectId;

  @Field(() => MemberType)
  memberType: MemberType;

  @Field(() => MemberStatus)
  memberStatus: MemberStatus;

  @Field(() => MemberAuthType)
  memberAuthType: MemberAuthType;

  @Field(() => String)
  memberPhone: string;

  @Field(() => String, { nullable: true })
  memberEmail?: string;

  @Field(() => String, { nullable: true })
  memberPlan: string;

  @Field(() => Int)
  memberPrograms: number;

  @Field(() => String)
  memberNick: string;

  memberPassword?: string;

  @Field(() => String, { nullable: true })
  memberFullName?: string;

  @Field(() => String, { nullable: true })
  memberImage?: string;

  @Field(() => String, { nullable: true })
  memberDesc?: string;

  @Field(() => String, { nullable: true })
  memberBio?: string;

  @Field(() => MemberSocial, { nullable: true })
  memberSocial?: MemberSocial;

  @Field(() => [String], { nullable: true })
  memberSpecialties?: string[];

  @Field(() => [String], { nullable: true })
  memberCertifications?: string[];

  @Field(() => Date, { nullable: true })
  dateOfBirth?: Date;

  @Field(() => String, { nullable: true })
  memberGender?: string;

  @Field(() => Float, { nullable: true })
  memberHeight?: number;

  @Field(() => Float, { nullable: true })
  memberWeight?: number;

  @Field(() => Int)
  memberFollowers?: number;

  @Field(() => Int)
  memberFollowings?: number;

  @Field(() => Int)
  memberPoints?: number;

  @Field(() => Int)
  memberLikes?: number;

  @Field(() => Int)
  memberViews?: number;

  @Field(() => Int)
  memberComments?: number;

  @Field(() => Int)
  memberRank?: number;

  @Field(() => Int)
  memberWarnings?: number;

  @Field(() => Date, { nullable: true })
  lastLoginAt?: Date;

  @Field(() => Date, { nullable: true })
  deletedAt?: Date;

  @Field(() => Date)
  createdAt?: Date;

  @Field(() => Date)
  updatedAt?: Date;

  @Field(() => String, { nullable: true })
  accessToken?: string;
}

@ObjectType()
export class Members {
  @Field(() => [Member])
  list: Member[];

  @Field(() => [TotalCounter], { nullable: true })
  metaCounter: TotalCounter[];
}

@ObjectType()
export class TotalCounter {
  @Field(() => Int, { nullable: true })
  total?: number;
}
