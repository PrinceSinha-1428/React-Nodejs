import { Response } from "express"

interface AppError extends Error {
   status: number;
}

export const resErrorHanlder = (error: unknown, res: Response) => {
   const statusCode = typeof error === "object" && error !== null && "status" in error
       ? (error as AppError).status
       : 500;
   const errorMessage = error instanceof Error ? error.message : "";
   return res.status(statusCode).json({
      success: false,
      message: errorMessage
   })
};
