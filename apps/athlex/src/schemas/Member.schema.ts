import { Schema } from 'mongoose';
import {
  MemberAuthType,
  MemberPlan,
  MemberStatus,
  MemberType,
} from '../libs/enums/member.enum';

const MemberSchema = new Schema(
  {
    memberType: {
      type: String,
      enum: MemberType,
      default: MemberType.USER,
    },

    memberStatus: {
      type: String,
      enum: MemberStatus,
      default: MemberStatus.ACTIVE,
    },

    memberAuthType: {
      type: String,
      enum: MemberAuthType,
      default: MemberAuthType.PHONE,
    },

    memberPhone: {
      type: String,
      index: { unique: true, sparse: true },
      required: true,
    },

    memberPlan: {
      type: String,
      enum: MemberPlan,
      default: MemberPlan.BEGINNER,
    },

    memberPrograms: {
      type: Number,
      default: 0,
    },

    memberNick: {
      type: String,
      index: { unique: true, sparse: true },
      required: true,
    },

    memberPassword: {
      type: String,
      select: false,
      required: true,
    },

    memberFullName: {
      type: String,
    },

    memberImage: {
      type: String,
      default: '',
    },

    memberDesc: {
      type: String,
    },

    memberFollowers: {
      type: Number,
      default: 0,
    },
    memberFollowings: {
      type: Number,
      default: 0,
    },
    memberPoints: {
      type: Number,
      default: 0,
    },
    memberLikes: {
      type: Number,
      default: 0,
    },
    memberViews: {
      type: Number,
      default: 0,
    },
    memberComments: {
      type: Number,
      default: 0,
    },
    memberRank: {
      type: Number,
      default: 0,
    },
    memberWarnings: {
      type: Number,
      default: 0,
    },
    deletedAt: {
      type: Date,
    },
  },
  { timestamps: true, collection: 'members' },
);
export default MemberSchema;
