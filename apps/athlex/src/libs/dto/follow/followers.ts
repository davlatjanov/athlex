import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Member } from '../member/member';
import { TotalCounter } from '../member/member';

@ObjectType()
export class Followers {
  @Field(() => [Member])
  list: Member[];

  @Field(() => [TotalCounter], { nullable: true })
  metaCounter: TotalCounter[];
}
