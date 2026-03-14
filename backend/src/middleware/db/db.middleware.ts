import { connectDB } from "@/config/db";
import { resErrorHanlder } from "@/config/error.handler";
import { NextFunction, Request, Response } from "express";

export const checkDBService = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const isConnected = await connectDB();
      if(!isConnected){
         return res.status(503).json({
            success: false,
            message: "Service Unavailable: Database service not available"
         })
      };
      next();
   } catch (error: unknown) {
      return resErrorHanlder(error, res);
   }
}