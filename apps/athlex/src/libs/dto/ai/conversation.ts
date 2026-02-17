import { Field, ObjectType } from '@nestjs/graphql';
import type { ObjectId } from 'mongoose';

@ObjectType()
export class ConversationMessage {
  @Field(() => String)
  role: string;

  @Field(() => String)
  content: string;

  @Field(() => Date)
  createdAt: Date;
}

@ObjectType()
export class Conversation {
  @Field(() => String)
  _id: ObjectId;

  @Field(() => String)
  memberId: ObjectId;

  @Field(() => String)
  title: string;

  @Field(() => [ConversationMessage])
  messages: ConversationMessage[];

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}

@ObjectType()
export class ConversationSummary {
  @Field(() => String)
  _id: ObjectId;

  @Field(() => String)
  title: string;

  @Field(() => Date)
  updatedAt: Date;
}
