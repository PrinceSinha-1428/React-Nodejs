import jwt, { SignOptions } from 'jsonwebtoken';
import { ENV, NODE_ENV } from './env.environment';

type Duration = "ms" | "s" | "m" | "h" | "d" | "w" | "y"

export const generateToken = (payload: Record<string, any>, time: number, duration: Duration) => {
   const options: SignOptions = {
     expiresIn: `${time}${duration}`,
   };  
   return jwt.sign(payload, ENV[NODE_ENV].jwt_secret, options);
};


// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InByaW5jZUBnbWFpbC5jb20iLCJpYXQiOjE3NzMyNjM4ODUsImV4cCI6MTc3MzI2Mzk0NX0.8sbBc53P30ljHhniDO1NV1mQodcEifRu9wXYlC-KaFQ