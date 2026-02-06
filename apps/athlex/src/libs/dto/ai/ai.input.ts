// libs/dto/ai/ai.input.ts
import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, Length } from 'class-validator';

@InputType()
export class AskAIInput {
  @IsNotEmpty()
  @Length(5, 500)
  @Field(() => String)
  question: string;

  @Field(() => String, { nullable: true })
  context?: string;
}

@InputType()
export class AIChatMessage {
  // ✅ Changed from ChatMessage to AIChatMessage
  @IsNotEmpty()
  @Field(() => String)
  role: string;

  @IsNotEmpty()
  @Field(() => String)
  content: string;
}

@InputType()
export class ChatAIInput {
  @IsNotEmpty()
  @Field(() => [AIChatMessage]) // ✅ Changed here too
  messages: AIChatMessage[];
}
