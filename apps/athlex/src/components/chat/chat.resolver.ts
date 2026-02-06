// components/chat/chat.resolver.ts
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import type { ObjectId } from 'mongoose';
import { ChatService } from './chat.service';
import {
  ChatRoom,
  ChatRooms,
  ChatMessage,
  ChatMessages,
} from '../../libs/dto/chat/chat';
import {
  CreateChatRoomInput,
  SendMessageInput,
  MarkMessagesReadInput,
  ChatRoomInquiry,
  ChatMessageInquiry,
} from '../../libs/dto/chat/chat.input';

@Resolver()
export class ChatResolver {
  constructor(private readonly chatService: ChatService) {}

  @UseGuards(AuthGuard)
  @Mutation(() => ChatRoom)
  public async createChatRoom(
    @Args('input') input: CreateChatRoomInput,
    @AuthMember('_id') memberId: ObjectId,
  ): Promise<ChatRoom> {
    console.log('Mutation: createChatRoom');
    return await this.chatService.createChatRoom(memberId, input);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => ChatMessage)
  public async sendMessage(
    @Args('input') input: SendMessageInput,
    @AuthMember('_id') memberId: ObjectId,
  ): Promise<ChatMessage> {
    console.log('Mutation: sendMessage');
    return await this.chatService.sendMessage(memberId, input);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  public async markMessagesAsRead(
    @Args('input') input: MarkMessagesReadInput,
    @AuthMember('_id') memberId: ObjectId,
  ): Promise<boolean> {
    console.log('Mutation: markMessagesAsRead');
    return await this.chatService.markMessagesAsRead(memberId, input);
  }

  @UseGuards(AuthGuard)
  @Query(() => ChatRooms)
  public async getMyChatRooms(
    @Args('input') input: ChatRoomInquiry,
    @AuthMember('_id') memberId: ObjectId,
  ): Promise<ChatRooms> {
    console.log('Query: getMyChatRooms');
    return await this.chatService.getMyChatRooms(memberId, input);
  }

  @UseGuards(AuthGuard)
  @Query(() => ChatMessages)
  public async getChatMessages(
    @Args('input') input: ChatMessageInquiry,
    @AuthMember('_id') memberId: ObjectId,
  ): Promise<ChatMessages> {
    console.log('Query: getChatMessages');
    return await this.chatService.getChatMessages(memberId, input);
  }
}
