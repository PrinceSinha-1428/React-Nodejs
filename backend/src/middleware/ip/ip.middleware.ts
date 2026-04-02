import { ENV, NODE_ENV } from "@/config/env.service";
import { resErrorHanlder } from "@/config/error.handler";
import { NextFunction, Request, Response } from "express";
import path from "path";

export const ipRestriction = async (req: Request, res: Response, next: NextFunction ) => {
   try {

      const isDev = ENV[NODE_ENV].ENABLE_IP_RESTRICTION !== 'true';
      if(isDev) return next();
      
      const country = req.headers["cf-ipcountry"] as string; 

      if (!country) {
         return next();
       };
      const allowedCountries = ["IN"];

      if(!allowedCountries.includes(country)){
         const forbidden = path.join(process.cwd(), 'public', 'forbidden.html')
         return res.status(403).sendFile(forbidden);
      }

      next();
   } catch (error: unknown) {
      return resErrorHanlder(error, res);
   }
}

