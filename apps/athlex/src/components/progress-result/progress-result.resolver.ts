import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import type { ObjectId } from 'mongoose';
import { ProgressResultService } from './progress-result.service';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { WithoutGuard } from '../auth/guards/without.guard';
import { getSerialForCloudinary, shapeIntoMongoObjectId, validMimeTypes } from '../../libs/config';
import { MemberType } from '../../libs/enums/member.enum';
import { Message } from '../../libs/enums/common.enum';
import { uploadToCloudinary } from '../../libs/utils/cloudinary-uploader';
import {
  ProgressResultInput,
  ProgressResultInquiry,
  ProgressResultUpdate,
} from '../../libs/dto/progress-result.ts/progress-result.input';
import {
  ProgressResult,
  ProgressResults,
} from '../../libs/dto/progress-result.ts/progress-result';

@Resolver()
export class ProgressResultResolver {
  constructor(private readonly progressResultService: ProgressResultService) {}

  @UseGuards(AuthGuard)
  @Mutation(() => ProgressResult)
  public async createProgressResult(
    @Args('input') input: ProgressResultInput,
    @Args('files', { type: () => [GraphQLUpload], nullable: true, defaultValue: [] })
    files: Promise<FileUpload>[],
    @AuthMember('_id') memberId: ObjectId,
  ): Promise<ProgressResult> {
    console.log('Mutation: createProgressResult');

    if (files?.length) {
      const uploadedUrls: string[] = [];
      await Promise.all(
        files.map(async (filePromise, index) => {
          const { filename, mimetype, createReadStream } = await filePromise;
          if (!validMimeTypes.includes(mimetype)) throw new Error(Message.PROVIDE_ALLOWED_FORMAT);
          const imageName = getSerialForCloudinary(filename);
          const url = await uploadToCloudinary(createReadStream(), 'progress', imageName);
          uploadedUrls[index] = url;
        }),
      );
      input.images = uploadedUrls.filter(Boolean);
    }

    return await this.progressResultService.createProgressResult(memberId, input);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => ProgressResult)
  public async updateProgressResult(
    @Args('input') input: ProgressResultUpdate,
    @AuthMember('_id') memberId: ObjectId,
  ): Promise<ProgressResult> {
    console.log('Mutation: updateProgressResult');
    return await this.progressResultService.updateProgressResult(
      memberId,
      input,
    );
  }

  @UseGuards(AuthGuard)
  @Mutation(() => ProgressResult)
  public async deleteProgressResult(
    @Args('progressResultId') progressResultId: string,
    @AuthMember('_id') memberId: ObjectId,
  ): Promise<ProgressResult> {
    console.log('Mutation: deleteProgressResult');
    const _id = shapeIntoMongoObjectId(progressResultId);
    return await this.progressResultService.deleteProgressResult(memberId, _id);
  }

  @UseGuards(WithoutGuard)
  @Query(() => ProgressResults)
  public async getProgressResults(
    @Args('input') input: ProgressResultInquiry,
  ): Promise<ProgressResults> {
    console.log('Query: getProgressResults');
    return await this.progressResultService.getProgressResults(input);
  }

  @UseGuards(AuthGuard)
  @Query(() => ProgressResults)
  public async getMyProgressResults(
    @Args('input') input: ProgressResultInquiry,
    @AuthMember('_id') memberId: ObjectId,
  ): Promise<ProgressResults> {
    console.log('Query: getMyProgressResults');
    return await this.progressResultService.getMyProgressResults(
      memberId,
      input,
    );
  }

  // Admin APIs
  @UseGuards(RolesGuard)
  @Roles(MemberType.ADMIN)
  @Mutation(() => ProgressResult)
  public async updateProgressResultByAdmin(
    @Args('input') input: ProgressResultUpdate,
  ): Promise<ProgressResult> {
    console.log('Mutation: updateProgressResultByAdmin');
    return await this.progressResultService.updateProgressResultByAdmin(input);
  }

  @UseGuards(RolesGuard)
  @Roles(MemberType.ADMIN)
  @Mutation(() => ProgressResult)
  public async deleteProgressResultByAdmin(
    @Args('progressResultId') progressResultId: string,
  ): Promise<ProgressResult> {
    console.log('Mutation: deleteProgressResultByAdmin');
    const _id = shapeIntoMongoObjectId(progressResultId);
    return await this.progressResultService.deleteProgressResultByAdmin(_id);
  }
}
