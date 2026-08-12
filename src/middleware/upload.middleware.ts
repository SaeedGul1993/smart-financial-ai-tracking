import multer from "multer";
import { startsWith } from "zod";
import { AppError } from "../errors/appError";
import { HTTP_STATUS } from "../constants/httpStatus";

const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (_req, file, cb) => {
    if ((file.mimetype, startsWith("image/"))) {
      cb(null, true);
    } else {
      cb(new AppError(HTTP_STATUS.BAD_REQUEST, "Only image files are allowed"));
    }
  },
});
