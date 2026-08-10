import { NextFunction, Request, Response } from "express";

export const globalErrorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  res.status(error?.statusCode || 500).json({
    statusCode: error?.statusCode || 500,
    success: false,
    message: error?.message || "Internal Server Error",
  });
};
