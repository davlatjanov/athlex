// components/ai/ai.resolver.ts
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { WithoutGuard } from '../auth/guards/without.guard';
import { AIService } from '../../libs/services/ai.service';
import { AIResponse } from '../../libs/dto/ai/ai';
import { AskAIInput, ChatAIInput } from '../../libs/dto/ai/ai.input';

@Resolver()
export class AIResolver {
  constructor(private readonly aiService: AIService) {}

  @UseGuards(WithoutGuard)
  @Query(() => AIResponse)
  public async askAI(@Args('input') input: AskAIInput): Promise<AIResponse> {
    console.log('Query: askAI');
    const answer = await this.aiService.askQuestion(
      input.question,
      input.context,
    );

    return {
      answer,
      timestamp: new Date(),
    };
  }

  @UseGuards(AuthGuard)
  @Mutation(() => AIResponse)
  public async chatWithAI(
    @Args('input') input: ChatAIInput,
  ): Promise<AIResponse> {
    console.log('Mutation: chatWithAI');
    const messages = input.messages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    const answer = await this.aiService.chatConversation(messages);

    return {
      answer,
      timestamp: new Date(),
    };
  }
}
