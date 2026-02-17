// components/ai/ai.resolver.ts
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { WithoutGuard } from '../auth/guards/without.guard';
import { AIService } from '../../libs/services/ai.service';
import { AIResponse } from '../../libs/dto/ai/ai';
import { AskAIInput, ChatAIInput } from '../../libs/dto/ai/ai.input';
import { Throttle } from '@nestjs/throttler';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import type { ObjectId } from 'mongoose';
import {
  Conversation,
  ConversationSummary,
} from '../../libs/dto/ai/conversation';

@Resolver()
export class AIResolver {
  constructor(private readonly aiService: AIService) {}

  @Throttle({ ai: { limit: 10, ttl: 60000 } })
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

  @Throttle({ ai: { limit: 10, ttl: 60000 } })
  @UseGuards(AuthGuard)
  @Mutation(() => AIResponse)
  public async chatWithAI(
    @Args('input') input: ChatAIInput,
    @AuthMember('_id') memberId: ObjectId,
  ): Promise<AIResponse> {
    console.log('Mutation: chatWithAI');
    const messages = input.messages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    const { answer, conversationId } = await this.aiService.chatConversation(
      memberId,
      messages,
      input.conversationId,
    );

    return {
      answer,
      conversationId,
      timestamp: new Date(),
    };
  }

  @UseGuards(AuthGuard)
  @Query(() => [ConversationSummary])
  public async getMyConversations(
    @AuthMember('_id') memberId: ObjectId,
  ): Promise<ConversationSummary[]> {
    console.log('Query: getMyConversations');
    return this.aiService.getMyConversations(memberId);
  }

  @UseGuards(AuthGuard)
  @Query(() => Conversation)
  public async getConversation(
    @Args('conversationId') conversationId: string,
    @AuthMember('_id') memberId: ObjectId,
  ): Promise<Conversation> {
    console.log('Query: getConversation');
    return this.aiService.getConversation(memberId, conversationId);
  }
}
