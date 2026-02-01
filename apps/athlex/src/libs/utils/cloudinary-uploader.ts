// libs/utils/cloudinary-uploader.ts

import { Readable } from 'stream';
import { v2 as cloudinary } from 'cloudinary';
import * as streamifier from 'streamifier';

/**
 * Upload stream to Cloudinary
 */
export const uploadToCloudinary = (
  stream: Readable,
  folder: string,
  filename: string,
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder, // e.g., "members", "products"
        public_id: filename, // uuid without extension
        resource_type: 'image',
        transformation: [
          { width: 1920, height: 1080, crop: 'limit' },
          { quality: 'auto:good' },
          { fetch_format: 'auto' },
        ],
      },
      (error, result) => {
        if (error) {
          console.log('Cloudinary error:', error);
          return reject(error);
        }
        //@ts-ignore
        resolve(result.secure_url); // Returns HTTPS URL
      },
    );

    stream.pipe(uploadStream);
  });
};
