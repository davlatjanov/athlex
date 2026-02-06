// libs/services/ai.service.ts
import { Injectable } from '@nestjs/common';
import Groq from 'groq-sdk';

@Injectable()
export class AIService {
  private groq: Groq;

  constructor() {
    this.groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
  }

  // Simple question
  async askQuestion(question: string): Promise<string> {
    try {
      const completion = await this.groq.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: `You are a helpful fitness assistant for Athlex platform. 
Help users with fitness, nutrition, and workout questions. Keep answers concise.`,
          },
          {
            role: 'user',
            content: question,
          },
        ],
        model: 'llama-3.1-70b-versatile',
        temperature: 0.7,
        max_tokens: 300,
      });

      return (
        completion.choices[0]?.message?.content || 'No response generated.'
      );
    } catch (error) {
      console.error('AI Error:', error);
      return 'Sorry, I am temporarily unavailable.';
    }
  }
}
