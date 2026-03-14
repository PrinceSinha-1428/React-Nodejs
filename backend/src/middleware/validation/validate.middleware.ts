import { resErrorHanlder } from "@/config/error.handler";
import { NextFunction, Request, Response } from "express";
import { ZodType, ZodError } from "zod";

export const validate = (schema: ZodType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error: unknown) {
      if (error instanceof ZodError) {

        const formattedErrors: Record<string, string> = {};

        error.issues.forEach((err) => {
          const field = err.path[0] as string;
          formattedErrors[field] = err.message;
        });
        
         return res.status(400).json({
          success: false,
          message: formattedErrors,
        });
      }
      return resErrorHanlder(error, res);
    }
  };
};
