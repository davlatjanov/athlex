// libs/dto/like/like.input.ts
import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { LikeGroup } from '../../enums/like.enum';

@InputType()
export class LikeInput {
  @IsNotEmpty()
  @Field(() => LikeGroup)
  likeGroup: LikeGroup;

  @IsNotEmpty()
  @Field(() => String)
  likeRefId: string;
}
