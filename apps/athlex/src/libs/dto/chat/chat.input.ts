// libs/dto/chat/chat.input.ts
import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, Length, Min } from 'class-validator';
import { MessageType } from '../../enums/chat.enum';
import { Direction } from '../../enums/common.enum';

@InputType()
export class CreateChatRoomInput {
  @IsNotEmpty()
  @Field(() => String)
  participantId: string; // The other user
}

@InputType()
export class SendMessageInput {
  @IsNotEmpty()
  @Field(() => String)
  chatRoomId: string;

  @IsNotEmpty()
  @Length(1, 1000)
  @Field(() => String)
  messageContent: string;

  @IsOptional()
  @Field(() => MessageType, { nullable: true })
  messageType?: MessageType;
}

@InputType()
export class MarkMessagesReadInput {
  @IsNotEmpty()
  @Field(() => String)
  chatRoomId: string;
}

@InputType()
export class ChatRoomInquiry {
  @IsNotEmpty()
  @Min(1)
  @Field(() => Int)
  page: number;

  @IsNotEmpty()
  @Min(1)
  @Field(() => Int)
  limit: number;

  @IsOptional()
  @Field(() => String, { nullable: true })
  sort?: string;

  @IsOptional()
  @Field(() => Direction, { nullable: true })
  direction?: Direction;
}

@InputType()
export class ChatMessageInquiry {
  @IsNotEmpty()
  @Field(() => String)
  chatRoomId: string;

  @IsNotEmpty()
  @Min(1)
  @Field(() => Int)
  page: number;

  @IsNotEmpty()
  @Min(1)
  @Field(() => Int)
  limit: number;
}
