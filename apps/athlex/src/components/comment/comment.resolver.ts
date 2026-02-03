import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import type { ObjectId } from 'mongoose';
import { CommentService } from './comment.service';
import { Comment, Comments } from '../../libs/dto/comment/comment';

import { CommentInput } from '../../libs/dto/comment/comment.input';
import { CommentUpdate } from '../../libs/dto/comment/comment.update';
import { CommentInquiry } from '../../libs/dto/comment/comment.inquiry';
import { WithoutGuard } from '../auth/guards/without.guard';
import { shapeIntoMongoObjectId } from '../../libs/config';
import { RolesGuard } from '../auth/guards/roles.guard';
import { MemberType } from '../../libs/enums/member.enum';
import { Roles } from '../auth/decorators/roles.decorator';

@Resolver()
export class CommentResolver {
  constructor(private readonly commentService: CommentService) {}

  @UseGuards(AuthGuard)
  @Mutation(() => Comment)
  public async createComment(
    @Args('input') input: CommentInput,
    @AuthMember('_id') memberId: ObjectId,
  ): Promise<Comment> {
    console.log('Mutation: createComment');
    return await this.commentService.createComment(memberId, input);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Comment)
  public async updateComment(
    @Args('input') input: CommentUpdate,
    @AuthMember('_id') memberId: ObjectId,
  ): Promise<Comment> {
    console.log('Mutation: updateComment');
    return await this.commentService.updateComment(memberId, input);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Comment)
  public async deleteComment(
    @Args('commentId') commentId: string,
    @AuthMember('_id') memberId: ObjectId,
  ): Promise<Comment> {
    console.log('Mutation: deleteComment');
    const _id = shapeIntoMongoObjectId(commentId);
    return await this.commentService.deleteComment(memberId, _id);
  }

  @UseGuards(WithoutGuard)
  @Query(() => Comments)
  public async getComments(
    @Args('input') input: CommentInquiry,
  ): Promise<Comments> {
    console.log('Query: getComments');
    return await this.commentService.getComments(input);
  }

  @UseGuards(RolesGuard)
  @Roles(MemberType.ADMIN)
  @Mutation(() => Comment)
  public async updateCommentByAdmin(
    @Args('input') input: CommentUpdate,
  ): Promise<Comment> {
    console.log('Mutation: updateCommentByAdmin');
    return await this.commentService.updateCommentByAdmin(input);
  }

  @UseGuards(RolesGuard)
  @Roles(MemberType.ADMIN)
  @Mutation(() => Comment)
  public async deleteCommentByAdmin(
    @Args('commentId') commentId: string,
  ): Promise<Comment> {
    console.log('Mutation: deleteCommentByAdmin');
    const _id = shapeIntoMongoObjectId(commentId);
    return await this.commentService.deleteCommentByAdmin(_id);
  }
}
