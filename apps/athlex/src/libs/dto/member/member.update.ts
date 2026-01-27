import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import mongoose from 'mongoose';
import {
  MemberAuthType,
  MemberStatus,
  MemberType,
} from '../../enums/member.enum';
import { IsNotEmpty, IsOptional } from 'class-validator';

@InputType()
export class MemberUpdate {
  @IsNotEmpty()
  @Field(() => String)
  _id?: string;

  @IsOptional()
  @Field(() => MemberType, { nullable: true })
  memberType: MemberType;

  @IsOptional()
  @Field(() => MemberStatus, { nullable: true })
  memberStatus: MemberStatus;

  @IsOptional()
  @Field(() => MemberAuthType, { nullable: true })
  memberAuthType: MemberAuthType;

  @IsOptional()
  @Field(() => String, { nullable: true })
  memberPhone: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  memberPlan: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  memberNick: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  memberPassword?: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  memberFullName?: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  memberImage?: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  memberDesc?: string;
}
