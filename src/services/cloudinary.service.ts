import { cloudinary } from "../config/cloudnary";
import { HTTP_STATUS } from "../constants/httpStatus";
import { AppError } from "../errors/appError";

export class CloudinaryService {
  async uploadPicture(buffer: Buffer): Promise<{
    secure_url: string;
    public_id: string;
  }> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "smart-finance/files",
          resource_type: "image",
        },

        (error, result) => {
          if (error || !result) {
            return reject(
              error ||
                new AppError(
                  HTTP_STATUS.BAD_REQUEST,
                  "Cloudinary upload failed",
                ),
            );
          }

          resolve({
            secure_url: result.secure_url,
            public_id: result.public_id,
          });
        },
      );
      uploadStream.end(buffer);
    });
  }
}
