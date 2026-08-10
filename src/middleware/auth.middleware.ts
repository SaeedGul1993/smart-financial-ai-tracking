import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/appError";
import { verifyToken } from "../utils/jwt";
import { HTTP_STATUS } from "../constants/httpStatus";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer "))
    throw new AppError(HTTP_STATUS.UNAUTHORIZED, "Unauthorized");
  const token = authHeader.split(" ")[1];
  if (!token) throw new AppError(HTTP_STATUS.UNAUTHORIZED, "Unauthorized");
  const decoded = verifyToken(token);
  (req as any).user = decoded;
  next();
};
