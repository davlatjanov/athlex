// libs/dto/follow/follow.input.ts
import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty, Min } from 'class-validator';

@InputType()
export class FollowInput {
  @IsNotEmpty()
  @Field(() => String)
  followingId: string;
}

@InputType()
export class FollowInquiry {
  @IsNotEmpty()
  @Min(1)
  @Field(() => Int)
  page: number;

  @IsNotEmpty()
  @Min(1)
  @Field(() => Int)
  limit: number;
}
