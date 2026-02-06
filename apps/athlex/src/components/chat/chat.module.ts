// components/chat/chat.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatResolver } from './chat.resolver';
import { ChatService } from './chat.service';
import ChatRoomSchema from '../../schemas/ChatRoom.schema';
import ChatMessageSchema from '../../schemas/ChatMessage.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'ChatRoom', schema: ChatRoomSchema },
      { name: 'ChatMessage', schema: ChatMessageSchema },
    ]),
    AuthModule,
  ],
  providers: [ChatResolver, ChatService],
  exports: [ChatService],
})
export class ChatModule {}
