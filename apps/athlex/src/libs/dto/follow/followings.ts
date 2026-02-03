// libs/dto/follow/followings.ts
import { Field, ObjectType } from '@nestjs/graphql';
import { Member } from '../member/member';
import { TotalCounter } from '../member/member';

@ObjectType()
export class Followings {
  @Field(() => [Member])
  list: Member[];

  @Field(() => [TotalCounter], { nullable: true })
  metaCounter: TotalCounter[];
}
