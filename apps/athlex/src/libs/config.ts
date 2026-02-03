import { ObjectId } from 'bson';
import { v4 as uuidv4 } from 'uuid';

export const shapeIntoMongoObjectId = (target: any) => {
  return typeof target === 'string' ? new ObjectId(target) : target;
};

/**  IMAGE CONFIGURATION **/

export const validMimeTypes = ['image/png', 'image/jpg', 'image/jpeg'];
export const getSerialForCloudinary = (filename: string) => {
  return uuidv4(); // No extension needed
};

export const availableTrainerSorts = [
  'createdAt',
  'updatedAt',
  'memberLikes',
  'memberViews',
  'memberRank',
];

export const availableCommentSorts = ['createdAt', 'updatedAt'];
export const availableMemberSorts = [
  'createdAt',
  'updatedAt',
  'memberLikes',
  'memberViews',
];

export const availableProductSorts = [
  'createdAt',
  'updatedAt',
  'productLikes',
  'productViews',
];

export const lookupMember = {
  $lookup: {
    from: 'members',
    localField: 'memberId',
    foreignField: '_id',
    as: 'memberData',
  },
};
