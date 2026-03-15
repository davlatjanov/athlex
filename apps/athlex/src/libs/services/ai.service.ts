// libs/services/ai.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import Groq from 'groq-sdk';
import type { ChatCompletionMessageParam } from 'groq-sdk/resources/chat/completions';
import { Conversation } from '../dto/ai/conversation';
import { shapeIntoMongoObjectId } from '../config';

const INJECTION_PATTERNS = [
  /ignore\s+(previous|all|above|prior)\s+(instructions?|prompts?|context)/i,
  /you\s+are\s+now/i,
  /act\s+as\s+(a\s+)?(?!fitness|trainer|coach)/i,
  /system\s*:/i,
  /\[system\]/i,
  /forget\s+(everything|all|previous)/i,
  /new\s+instructions?\s*:/i,
  /disregard\s+(all|previous|your)/i,
];

@Injectable()
export class AIService {
  private groq: Groq;

  constructor(
    @InjectModel('Conversation') private conversationModel: Model<Conversation>,
    @InjectModel('ProgramEnrollment') private enrollmentModel: Model<any>,
    @InjectModel('Program') private programModel: Model<any>,
    @InjectModel('ProgressResult') private progressResultModel: Model<any>,
  ) {
    this.groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
  }

  private sanitizeContext(context: string): string {
    let sanitized = context;
    for (const pattern of INJECTION_PATTERNS) {
      sanitized = sanitized.replace(pattern, '[removed]');
    }
    return sanitized;
  }

  private async buildUserContext(memberId: ObjectId): Promise<string> {
    try {
      const memberObjId = shapeIntoMongoObjectId(memberId);

      const enrollments = await this.enrollmentModel
        .find({ memberId: memberObjId })
        .limit(3)
        .lean()
        .exec();

      const programIds = enrollments.map((e) => e.programId);
      const programs = await this.programModel
        .find({ _id: { $in: programIds } })
        .select('programName programType programLevel programDuration')
        .lean()
        .exec();

      const recentProgress = await this.progressResultModel
        .find({ memberId: memberObjId })
        .sort({ createdAt: -1 })
        .limit(3)
        .select('content createdAt')
        .lean()
        .exec();

      const lines: string[] = [];

      if (programs.length > 0) {
        lines.push('User active programs:');
        for (const p of programs) {
          lines.push(
            `- ${p.programName} (${p.programType}, ${p.programLevel}, ${p.programDuration} weeks)`,
          );
        }
      }

      if (recentProgress.length > 0) {
        lines.push('Recent progress notes:');
        for (const pr of recentProgress) {
          const date = new Date(pr.createdAt).toLocaleDateString();
          lines.push(`- [${date}] ${pr.content.slice(0, 120)}`);
        }
      }

      return lines.join('\n');
    } catch {
      return '';
    }
  }

  async askQuestion(question: string, context?: string): Promise<string> {
    try {
      const safeContext = context ? this.sanitizeContext(context) : undefined;

      const systemPrompt = `You are a helpful fitness assistant for Athlex, a fitness platform.
You help users with:
- General fitness questions
- Workout advice
- Nutrition basics
- Program recommendations
- Platform navigation help

Keep answers concise (2-3 paragraphs max), friendly, and fitness-focused.
${safeContext ? `Additional context: ${safeContext}` : ''}`;

      const completion = await this.groq.chat.completions.create({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: question },
        ],
        model: 'llama-3.3-70b-versatile',
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
    memberId: ObjectId,
    messages: { role: string; content: string }[],
    conversationId?: string,
  ): Promise<{ answer: string; conversationId: string }> {
    try {
      let conversation: any;

      if (conversationId) {
        conversation = await this.conversationModel
          .findOne({
            _id: shapeIntoMongoObjectId(conversationId),
            memberId: shapeIntoMongoObjectId(memberId),
          })
          .exec();
      }

      if (!conversation) {
        const firstUserMessage = messages.find((m) => m.role === 'user');
        const title = firstUserMessage
          ? firstUserMessage.content.slice(0, 60)
          : 'New Chat';

        conversation = await this.conversationModel.create({
          memberId: shapeIntoMongoObjectId(memberId),
          title,
          messages: [],
        });
      }

      const userContext = await this.buildUserContext(memberId);

      const systemContent = [
        'You are a helpful fitness assistant for Athlex. Be concise, friendly, and fitness-focused.',
        userContext ? `\nUser context:\n${userContext}` : '',
      ]
        .filter(Boolean)
        .join('');

      const systemMessage: ChatCompletionMessageParam = {
        role: 'system',
        content: systemContent,
      };

      // Last 20 stored messages to stay within context window
      const storedMessages = (conversation.messages as any[]).slice(-20).map(
        (m: any): ChatCompletionMessageParam => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        }),
      );

      const newMessages: ChatCompletionMessageParam[] = messages.map((msg) => ({
        role: msg.role as 'user' | 'assistant' | 'system',
        content: msg.content,
      }));

      const completion = await this.groq.chat.completions.create({
        messages: [systemMessage, ...storedMessages, ...newMessages],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.7,
        max_tokens: 500,
      });

      const answer =
        completion.choices[0]?.message?.content ||
        'Sorry, I could not generate a response.';

      const toSave = [
        ...messages.map((m) => ({ ...m, createdAt: new Date() })),
        { role: 'assistant', content: answer, createdAt: new Date() },
      ];

      await this.conversationModel.findByIdAndUpdate(conversation._id, {
        $push: { messages: { $each: toSave } },
      });

      return { answer, conversationId: conversation._id.toString() };
    } catch (error) {
      console.error('AI Chat Error:', error);
      return {
        answer: 'Sorry, I am temporarily unavailable.',
        conversationId: conversationId ?? '',
      };
    }
  }

  async getMyConversations(memberId: ObjectId): Promise<any[]> {
    return this.conversationModel
      .find({ memberId: shapeIntoMongoObjectId(memberId) })
      .select('_id title updatedAt')
      .sort({ updatedAt: -1 })
      .limit(20)
      .lean()
      .exec();
  }

  async getConversation(
    memberId: ObjectId,
    conversationId: string,
  ): Promise<any> {
    return this.conversationModel
      .findOne({
        _id: shapeIntoMongoObjectId(conversationId),
        memberId: shapeIntoMongoObjectId(memberId),
      })
      .lean()
      .exec();
  }

  async deleteConversation(
    memberId: ObjectId,
    conversationId: string,
  ): Promise<boolean> {
    const result = await this.conversationModel.deleteOne({
      _id: shapeIntoMongoObjectId(conversationId),
      memberId: shapeIntoMongoObjectId(memberId),
    });
    return result.deletedCount > 0;
  }
}
