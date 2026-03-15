import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Like } from '../../libs/dto/like/like';
import { LikeInput } from '../../libs/dto/like/like.input';
import { Message } from '../../libs/enums/common.enum';
import { LikeGroup } from '../../libs/enums/like.enum';
import { MemberService } from '../member/member.service';
import { ProductService } from '../product/product.service';
import { TrainingProgramService } from '../training-program/training-program.service';
import { shapeIntoMongoObjectId } from '../../libs/config';

@Injectable()
export class LikeService {
  constructor(
    @InjectModel('Like') private likeModel: Model<Like>,
    private readonly memberService: MemberService,
    private readonly productService: ProductService,
    private readonly trainingProgramService: TrainingProgramService,
  ) {}

  public async likeTargetItem(
    memberId: ObjectId,
    input: LikeInput,
  ): Promise<Like> {
    const { likeGroup, likeRefId } = input;

    // Check if already liked
    const existingLike = await this.likeModel
      .findOne({ memberId, likeRefId })
      .exec();

    if (existingLike) {
      // Unlike - remove the like
      await this.likeModel.findByIdAndDelete(existingLike._id).exec();

      // Decrement like count based on group
      await this.updateLikeCount(likeGroup, likeRefId, -1);

      return existingLike;
    } else {
      // Like - create new like
      const newLike = await this.likeModel.create({
        memberId,
        likeRefId,
        likeGroup,
      });

      if (!newLike) {
        throw new InternalServerErrorException(Message.CREATE_FAILED);
      }

      // Increment like count based on group
      await this.updateLikeCount(likeGroup, likeRefId, 1);

      return newLike;
    }
  }

  public async checkIfUserLiked(
    memberId: ObjectId,
    likeRefId: string,
  ): Promise<boolean> {
    const like = await this.likeModel
      .findOne({ memberId, likeRefId: shapeIntoMongoObjectId(likeRefId) })
      .exec();
    return !!like;
  }

  private async updateLikeCount(
    likeGroup: LikeGroup,
    likeRefId: string,
    increment: number,
  ): Promise<void> {
    const targetId = shapeIntoMongoObjectId(likeRefId);

    switch (likeGroup) {
      case LikeGroup.MEMBER:
        await this.memberService.updateMemberByLike(targetId, increment);
        break;

      case LikeGroup.PRODUCT:
        await this.productService.updateProductByLike(targetId, increment);
        break;

      case LikeGroup.PROGRAM:
        await this.trainingProgramService.updateProgramByLike(
          targetId,
          increment,
        );
        break;

      default:
        break;
    }
  }
}
