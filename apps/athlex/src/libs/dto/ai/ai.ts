// libs/dto/ai/ai.ts
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AIResponse {
  @Field(() => String)
  answer: string;

  @Field(() => String, { nullable: true })
  conversationId?: string;

  @Field(() => Date)
  timestamp: Date;
}
