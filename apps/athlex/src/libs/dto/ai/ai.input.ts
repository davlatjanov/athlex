// libs/dto/ai/ai.input.ts
import { Field, InputType } from '@nestjs/graphql';
import { IsIn, IsNotEmpty, IsOptional, Length, MaxLength } from 'class-validator';

@InputType()
export class AskAIInput {
  @IsNotEmpty()
  @Length(5, 500)
  @Field(() => String)
  question: string;

  @IsOptional()
  @MaxLength(300)
  @Field(() => String, { nullable: true })
  context?: string;
}

@InputType()
export class AIChatMessage {
  @IsIn(['user', 'assistant'])
  @Field(() => String)
  role: string;

  @IsNotEmpty()
  @MaxLength(2000)
  @Field(() => String)
  content: string;
}

@InputType()
export class ChatAIInput {
  @IsNotEmpty()
  @Field(() => [AIChatMessage])
  messages: AIChatMessage[];

  @IsOptional()
  @Field(() => String, { nullable: true })
  conversationId?: string;
}
