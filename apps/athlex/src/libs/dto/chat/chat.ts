// libs/dto/chat/chat.ts
import { Field, Int, ObjectType } from '@nestjs/graphql';
import type { ObjectId } from 'mongoose';
import { Member } from '../member/member';
import { MessageType, MessageStatus } from '../../enums/chat.enum';
import { TotalCounter } from '../member/member';

@ObjectType()
export class ChatRoom {
  @Field(() => String)
  _id: ObjectId;

  @Field(() => [String])
  participants: ObjectId[];

  @Field(() => String, { nullable: true })
  lastMessage?: string;

  @Field(() => Date, { nullable: true })
  lastMessageAt?: Date;

  @Field(() => Boolean)
  isActive: boolean;

  @Field(() => [Member], { nullable: true })
  participantData?: Member[];

  @Field(() => Int, { nullable: true })
  unreadCount?: number;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}

@ObjectType()
export class ChatMessage {
  @Field(() => String)
  _id: ObjectId;

  @Field(() => String)
  chatRoomId: ObjectId;

  @Field(() => String)
  senderId: ObjectId;

  @Field(() => String)
  messageContent: string;

  @Field(() => MessageType)
  messageType: MessageType;

  @Field(() => MessageStatus)
  messageStatus: MessageStatus;

  @Field(() => Date, { nullable: true })
  readAt?: Date;

  @Field(() => Member, { nullable: true })
  senderData?: Member;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}

@ObjectType()
export class ChatRooms {
  @Field(() => [ChatRoom])
  list: ChatRoom[];

  @Field(() => [TotalCounter], { nullable: true })
  metaCounter: TotalCounter[];
}

@ObjectType()
export class ChatMessages {
  @Field(() => [ChatMessage])
  list: ChatMessage[];

  @Field(() => [TotalCounter], { nullable: true })
  metaCounter: TotalCounter[];
}
