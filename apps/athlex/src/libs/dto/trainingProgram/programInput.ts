import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional } from 'class-validator';

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
