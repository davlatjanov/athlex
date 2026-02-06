// schemas/ChatMessage.schema.ts
import { Schema } from 'mongoose';

const ChatMessageSchema = new Schema(
  {
    chatRoomId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'ChatRoom',
    },
    senderId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Member',
    },
    messageContent: {
      type: String,
      required: true,
    },
    messageType: {
      type: String,
      enum: ['TEXT', 'IMAGE', 'FILE'],
      default: 'TEXT',
    },
    messageStatus: {
      type: String,
      enum: ['SENT', 'DELIVERED', 'READ'],
      default: 'SENT',
    },
    readAt: {
      type: Date,
    },
  },
  { timestamps: true, collection: 'chatMessages' },
);

ChatMessageSchema.index({ chatRoomId: 1, createdAt: -1 });
ChatMessageSchema.index({ senderId: 1 });

export default ChatMessageSchema;
