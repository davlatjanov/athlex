// libs/services/ai.service.ts
import { Injectable } from '@nestjs/common';
import Groq from 'groq-sdk';
import type { ChatCompletionMessageParam } from 'groq-sdk/resources/chat/completions';

@Injectable()
export class AIService {
  private groq: Groq;

  constructor() {
    this.groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
  }

  async askQuestion(question: string, context?: string): Promise<string> {
    try {
      const systemPrompt = `You are a helpful fitness assistant for Athlex, a fitness platform.
You help users with:
- General fitness questions
- Workout advice
- Nutrition basics
- Program recommendations
- Platform navigation help

Keep answers concise (2-3 paragraphs max), friendly, and fitness-focused.
${context ? `Additional context: ${context}` : ''}`;

      const completion = await this.groq.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            content: question,
          },
        ],
        model: 'llama-3.1-70b-versatile',
        temperature: 0.7,
        max_tokens: 400,
      });

      return (
        completion.choices[0]?.message?.content ||
        'Sorry, I could not generate a response.'
      );
    } catch (error) {
      console.error('AI Service Error:', error);
      return 'Sorry, I am temporarily unavailable. Please try again later.';
    }
  }

  async chatConversation(
    messages: { role: string; content: string }[],
  ): Promise<string> {
    try {
      const systemMessage: ChatCompletionMessageParam = {
        role: 'system',
        content: `You are a helpful fitness assistant for Athlex. Be concise, friendly, and fitness-focused.`,
      };

      // Convert messages to proper type
      const formattedMessages: ChatCompletionMessageParam[] = messages.map(
        (msg) => ({
          role: msg.role as 'user' | 'assistant' | 'system',
          content: msg.content,
        }),
      );

      const completion = await this.groq.chat.completions.create({
        messages: [systemMessage, ...formattedMessages],
        model: 'llama-3.1-70b-versatile',
        temperature: 0.7,
        max_tokens: 400,
      });

      return (
        completion.choices[0]?.message?.content ||
        'Sorry, I could not generate a response.'
      );
    } catch (error) {
      console.error('AI Chat Error:', error);
      return 'Sorry, I am temporarily unavailable.';
    }
  }
}
