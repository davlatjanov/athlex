// libs/dto/progress-result/progress-result.input.ts
import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, Length, Min } from 'class-validator';
import { ProgressResultStatus } from '../../enums/progress-result.enum';
import { Direction } from '../../enums/common.enum';

@InputType()
export class ProgressResultInput {
  @IsOptional()
  @Field(() => String, { nullable: true })
  programId?: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  trainerId?: string;

  @IsOptional()
  @Field(() => [String], { nullable: true })
  images?: string[];

  @IsNotEmpty()
  @Length(1, 1000)
  @Field(() => String)
  content: string;
}

@InputType()
export class ProgressResultUpdate {
  @IsNotEmpty()
  @Field(() => String)
  _id: string;

  @IsOptional()
  @Field(() => ProgressResultStatus, { nullable: true })
  status?: ProgressResultStatus;

  @IsOptional()
  @Field(() => [String], { nullable: true })
  images?: string[];

  @IsOptional()
  @Length(10, 1000)
  @Field(() => String, { nullable: true })
  content?: string;
}

@InputType()
export class ProgressResultInquiry {
  @IsNotEmpty()
  @Min(1)
  @Field(() => Int)
  page: number;

  @IsNotEmpty()
  @Min(1)
  @Field(() => Int)
  limit: number;

  @IsOptional()
  @Field(() => String, { nullable: true })
  sort?: string;

  @IsOptional()
  @Field(() => Direction, { nullable: true })
  direction?: Direction;

  @IsOptional()
  @Field(() => String, { nullable: true })
  programId?: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  memberId?: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  trainerId?: string;

  @IsOptional()
  @Field(() => ProgressResultStatus, { nullable: true })
  status?: ProgressResultStatus;
}
