import { NextFunction, Request, Response } from "express";
import z from "zod";

export const validationPipe = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body || req.query);
    if (!result.success) {
      return res.status(400).json({
        message: "Bad Request",
        errors: result.error.flatten().fieldErrors,
      });
    }
    req.body = result.data;
    next();
  };
};
