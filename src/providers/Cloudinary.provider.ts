import cloudinary from 'cloudinary';
import streamifier from 'streamifier';

const cloudinaryv2 = cloudinary.v2;

cloudinaryv2.config({
  cloud_name: process.env.CLOUDINARY_NAME as string,
  api_key: process.env.CLOUDINARY_API_KEY as string,
  api_secret: process.env.CLOUDINARY_API_SECRET as string
});

/**
 * Uploads a file to Cloudinary using a stream.
 * @param fileBuffer - The file data in Buffer format.
 * @param folderName - The name of the folder in Cloudinary.
 * @returns A Promise containing the upload result.
 */
const streamUpload = (
  fileBuffer: Buffer,
  folderName: string
): Promise<cloudinary.UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinaryv2.uploader.upload_stream({ folder: folderName }, (error, result) => {
      if (result) resolve(result);
      else reject(new Error(error?.message || 'Upload failed'));
    });

    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

export const CloudinaryProvider = { streamUpload };
