import { Field, InputType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

@InputType()
export class ProgramUpdate {
  @IsOptional()
  @Field(() => String, { nullable: true })
  programName?: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  programStartDate?: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  programEndDate?: string;

  @IsOptional()
  @Field(() => [String], { nullable: true })
  programImages?: string[];

  @IsOptional()
  @Field(() => String, { nullable: true })
  programDesc?: string;
}
