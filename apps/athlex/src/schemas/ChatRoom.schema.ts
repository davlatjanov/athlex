// schemas/ChatRoom.schema.ts
import { Schema } from 'mongoose';

const ChatRoomSchema = new Schema(
  {
    participants: [
      {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Member',
      },
    ],
    lastMessage: {
      type: String,
    },
    lastMessageAt: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true, collection: 'chatRooms' },
);

// Ensure only 2 participants per room
ChatRoomSchema.index({ participants: 1 });

// Compound index to find room between 2 users quickly
ChatRoomSchema.index(
  { 'participants.0': 1, 'participants.1': 1 },
  { unique: true },
);

export default ChatRoomSchema;
