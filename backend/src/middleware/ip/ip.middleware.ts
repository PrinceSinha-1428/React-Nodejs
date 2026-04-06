import { resErrorHanlder } from "@/config/error.handler";
import { NextFunction, Request, Response } from "express";
import path from "path";

export const ipRestriction = async (req: Request, res: Response, next: NextFunction ) => {
   try {
      
      const country = req.headers["cf-ipcountry"] as string; 
      console.log({country})
      if (!country) {
         return next(); 
      }

      console.log({country})

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

