import { Field, Float, InputType } from '@nestjs/graphql';
import {
  MemberAuthType,
  MemberStatus,
  MemberType,
} from '../../enums/member.enum';
import { IsNotEmpty, IsOptional, Length } from 'class-validator';

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
  memberEmail?: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  memberPlan: string;

  @IsOptional()
  @Length(3, 12)
  @Field(() => String, { nullable: true })
  memberNick?: string;

  @IsOptional()
  @Length(5, 12)
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

  @IsOptional()
  @Field(() => String, { nullable: true })
  memberBio?: string;

  @IsOptional()
  @Field(() => [String], { nullable: true })
  memberSpecialties?: string[];

  @IsOptional()
  @Field(() => [String], { nullable: true })
  memberCertifications?: string[];

  @IsOptional()
  @Field(() => Date, { nullable: true })
  dateOfBirth?: Date;

  @IsOptional()
  @Field(() => String, { nullable: true })
  memberGender?: string;

  @IsOptional()
  @Field(() => Float, { nullable: true })
  memberHeight?: number;

  @IsOptional()
  @Field(() => Float, { nullable: true })
  memberWeight?: number;
}
