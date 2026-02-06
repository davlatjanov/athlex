// components/chat/chat.service.ts
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
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
import { Direction, Message } from '../../libs/enums/common.enum';
import { MessageStatus } from '../../libs/enums/chat.enum';
import { shapeIntoMongoObjectId } from '../../libs/config';
import { T } from '../../libs/types/common';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel('ChatRoom') private chatRoomModel: Model<ChatRoom>,
    @InjectModel('ChatMessage') private chatMessageModel: Model<ChatMessage>,
  ) {}

  public async createChatRoom(
    memberId: ObjectId,
    input: CreateChatRoomInput,
  ): Promise<ChatRoom> {
    const participantId = shapeIntoMongoObjectId(input.participantId);

    // Check if chat room already exists
    const existingRoom = await this.chatRoomModel
      .findOne({
        participants: { $all: [memberId, participantId] },
      })
      .exec();

    if (existingRoom) {
      return existingRoom; // Return existing room
    }

    // Create new chat room
    // Sort participants to ensure consistent order for indexing
    const participants = [memberId, participantId].sort();

    const newChatRoom = await this.chatRoomModel.create({
      participants,
    });

    if (!newChatRoom) {
      throw new InternalServerErrorException(Message.CREATE_FAILED);
    }

    return newChatRoom;
  }

  public async sendMessage(
    memberId: ObjectId,
    input: SendMessageInput,
  ): Promise<ChatMessage> {
    const chatRoomId = shapeIntoMongoObjectId(input.chatRoomId);

    // Verify user is participant
    const chatRoom = await this.chatRoomModel
      .findOne({
        _id: chatRoomId,
        participants: memberId,
      })
      .exec();

    if (!chatRoom) {
      throw new InternalServerErrorException('Chat room not found');
    }

    // Create message
    const newMessage = await this.chatMessageModel.create({
      chatRoomId,
      senderId: memberId,
      messageContent: input.messageContent,
      messageType: input.messageType || 'TEXT',
    });

    if (!newMessage) {
      throw new InternalServerErrorException(Message.CREATE_FAILED);
    }

    // Update chat room with last message
    await this.chatRoomModel.findByIdAndUpdate(chatRoomId, {
      lastMessage: input.messageContent.substring(0, 100),
      lastMessageAt: new Date(),
    });

    return newMessage;
  }

  public async markMessagesAsRead(
    memberId: ObjectId,
    input: MarkMessagesReadInput,
  ): Promise<boolean> {
    const chatRoomId = shapeIntoMongoObjectId(input.chatRoomId);

    // Mark all unread messages in this room as read
    // Only messages not sent by current user
    await this.chatMessageModel.updateMany(
      {
        chatRoomId,
        senderId: { $ne: memberId },
        messageStatus: { $ne: MessageStatus.READ },
      },
      {
        messageStatus: MessageStatus.READ,
        readAt: new Date(),
      },
    );

    return true;
  }

  public async getMyChatRooms(
    memberId: ObjectId,
    input: ChatRoomInquiry,
  ): Promise<ChatRooms> {
    const { page, limit, sort, direction } = input;

    const sortOption: T = {
      [sort ?? 'lastMessageAt']: direction ?? Direction.DESC,
    };

    const result = await this.chatRoomModel
      .aggregate([
        { $match: { participants: memberId, isActive: true } },
        { $sort: sortOption },
        {
          $lookup: {
            from: 'members',
            localField: 'participants',
            foreignField: '_id',
            as: 'participantData',
          },
        },
        // Get unread message count
        {
          $lookup: {
            from: 'chatMessages',
            let: { roomId: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ['$chatRoomId', '$$roomId'] },
                      { $ne: ['$senderId', memberId] },
                      { $ne: ['$messageStatus', MessageStatus.READ] },
                    ],
                  },
                },
              },
              { $count: 'count' },
            ],
            as: 'unreadMessages',
          },
        },
        {
          $addFields: {
            unreadCount: {
              $ifNull: [{ $arrayElemAt: ['$unreadMessages.count', 0] }, 0],
            },
          },
        },
        {
          $facet: {
            list: [{ $skip: (page - 1) * limit }, { $limit: limit }],
            metaCounter: [{ $count: 'total' }],
          },
        },
      ])
      .exec();

    if (!result.length) {
      throw new InternalServerErrorException(Message.NO_DATA_FOUND);
    }

    return result[0];
  }

  public async getChatMessages(
    memberId: ObjectId,
    input: ChatMessageInquiry,
  ): Promise<ChatMessages> {
    const { chatRoomId, page, limit } = input;
    const roomId = shapeIntoMongoObjectId(chatRoomId);

    // Verify user is participant
    const chatRoom = await this.chatRoomModel
      .findOne({
        _id: roomId,
        participants: memberId,
      })
      .exec();

    if (!chatRoom) {
      throw new InternalServerErrorException('Chat room not found');
    }

    const result = await this.chatMessageModel
      .aggregate([
        { $match: { chatRoomId: roomId } },
        { $sort: { createdAt: -1 } }, // Newest first
        {
          $facet: {
            list: [
              { $skip: (page - 1) * limit },
              { $limit: limit },
              {
                $lookup: {
                  from: 'members',
                  localField: 'senderId',
                  foreignField: '_id',
                  as: 'senderData',
                },
              },
              { $unwind: '$senderData' },
            ],
            metaCounter: [{ $count: 'total' }],
          },
        },
      ])
      .exec();

    if (!result.length) {
      throw new InternalServerErrorException(Message.NO_DATA_FOUND);
    }

    return result[0];
  }
}
