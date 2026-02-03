import { Field, InputType, Int } from '@nestjs/graphql';
import { IsIn, IsNotEmpty, IsOptional, Min } from 'class-validator';
import { Direction } from '../../enums/common.enum';

@InputType()
export class ProgramInput {
  @IsNotEmpty()
  @Field(() => String)
  programName: string;

  @IsNotEmpty()
  @Field(() => String)
  programStartDate: string;

  @IsNotEmpty()
  @Field(() => String)
  programEndDate: string;

  @IsOptional()
  @Field(() => [String], { nullable: true })
  programImages?: string[];

  @IsOptional()
  @Field(() => String, { nullable: true })
  programDesc?: string;
}

@InputType()
export class PISearch {
  @IsOptional()
  @Field(() => String, { nullable: true })
  programName?: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  memberId?: string;
}

@InputType()
export class ProgramInquiry {
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
  @IsIn(Object.values(Direction))
  @Field(() => String, { nullable: true })
  direction?: Direction;

  @IsOptional()
  @Field(() => PISearch, { nullable: true })
  search?: PISearch;
}
