import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { MemberService } from './member.service';
import { Member, Members } from '../../libs/dto/member/member';
import {
  LoginInput,
  MemberInput,
  TrainersInquiry,
} from '../../libs/dto/member/member.input';
import { AuthGuard } from '../auth/guards/auth.guard';
import { UseGuards } from '@nestjs/common';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import type { ObjectId } from 'mongoose';
import type { T } from '../../libs/types/common';
import { MemberUpdate } from '../../libs/dto/member/member.update';
import { WithoutGuard } from '../auth/guards/without.guard';
import {
  getSerialForCloudinary,
  shapeIntoMongoObjectId,
  validMimeTypes,
} from '../../libs/config';

import { GraphQLUpload, FileUpload } from 'graphql-upload';
import { uploadToCloudinary } from '../../libs/utils/cloudinary-uploader';
import { Message } from '../../libs/enums/common.enum';

@Resolver()
export class MemberResolver {
  constructor(private readonly memberService: MemberService) {}

  @Mutation(() => Member)
  public async signUp(
    @Args('input') signUpInput: MemberInput,
  ): Promise<Member> {
    console.log('Mutation signUp');
    return await this.memberService.signUp(signUpInput);
  }

  @Mutation(() => Member)
  public async login(@Args('input') input: LoginInput): Promise<Member | null> {
    console.log('Mutation login');
    return await this.memberService.login(input);
  }

  @UseGuards(AuthGuard)
  @Query(() => String)
  public async checkAuth(@AuthMember() member: T): Promise<string> {
    console.log('Query checkAuth');
    console.log(
      `Hello ${member.memberNick}  your ID => ${member._id} and you are ${member.memberType}`,
    );
    return `Hello ${member.memberNick}  your ID => ${member._id} and you are ${member.memberType}`;
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Member)
  public async updateMember(
    @Args('input') input: MemberUpdate,
    @AuthMember('_id') memberId: ObjectId,
  ): Promise<Member> {
    console.log('Mutation updateMember');
    delete input._id;
    return await this.memberService.updateMember(memberId, input);
  }

  @UseGuards(WithoutGuard)
  @Query(() => Member)
  public async getMember(
    @Args('memberId') targetId: string, // ✅ Clearer name
    @AuthMember('_id') memberId: ObjectId, // Current user
  ): Promise<Member> {
    console.log('Query getMember');
    const targetObjectId = shapeIntoMongoObjectId(targetId);
    return this.memberService.getMember(memberId, targetObjectId);
  }

  @UseGuards(WithoutGuard)
  @Query(() => Members)
  public async getTrainers(
    @Args('input') input: TrainersInquiry,
    @AuthMember('_id') memberId: ObjectId,
  ): Promise<Members> {
    console.log('Query getAgents');
    return this.memberService.getTrainers(memberId, input);
  }

  //UPLOADER
  @UseGuards(AuthGuard)
  @Mutation(() => String)
  public async imageUploader(
    @Args({ name: 'file', type: () => GraphQLUpload })
    { createReadStream, filename, mimetype }: FileUpload,
    @Args('target') target: string,
    @AuthMember('_id') memberId: ObjectId,
  ): Promise<string> {
    console.log('Mutation: imageUploader');

    if (!filename) throw new Error(Message.UPLOAD_FAILED);

    const validMime = validMimeTypes.includes(mimetype);
    if (!validMime) throw new Error(Message.PROVIDE_ALLOWED_FORMAT);

    // Generate unique filename (without extension)
    const imageName = getSerialForCloudinary(filename);

    // Get stream
    const stream = createReadStream();

    try {
      // Upload to Cloudinary
      const cloudinaryUrl = await uploadToCloudinary(stream, target, imageName);

      await this.memberService.updateMember(memberId, {
        memberImage: cloudinaryUrl,
      });
      return cloudinaryUrl;
    } catch (error) {
      console.error('Upload error:', error);
      throw new Error(Message.UPLOAD_FAILED);
    }
  }

  @UseGuards(AuthGuard)
  @Mutation(() => [String])
  public async imagesUploader(
    @Args('files', { type: () => [GraphQLUpload] })
    files: Promise<FileUpload>[],
    @Args('target') target: string, // e.g., "products"
  ): Promise<string[]> {
    console.log('Mutation: imagesUploader');

    const uploadedImages: string[] = [];

    const promisedList = files.map(
      async (img: Promise<FileUpload>, index: number) => {
        try {
          const { filename, mimetype, createReadStream } = await img;

          const validMime = validMimeTypes.includes(mimetype);
          if (!validMime) throw new Error(Message.PROVIDE_ALLOWED_FORMAT);

          const imageName = getSerialForCloudinary(filename);
          const stream = createReadStream();

          // Upload to Cloudinary
          const cloudinaryUrl = await uploadToCloudinary(
            stream,
            target,
            imageName,
          );

          uploadedImages[index] = cloudinaryUrl;
        } catch (err) {
          console.log('Error uploading file:', err);
        }
      },
    );

    await Promise.all(promisedList);
    return uploadedImages;
  }
}
