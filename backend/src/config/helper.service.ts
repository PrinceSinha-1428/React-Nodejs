import jwt, { SignOptions } from "jsonwebtoken";
import { ENV, NODE_ENV } from "./env.service";

type Duration = "ms" | "s" | "m" | "h" | "d" | "w" | "y";

export const generateToken = (
  payload: Record<string, any>,
  time: number,
  duration: Duration,
) => {
  const options: SignOptions = {
    expiresIn: `${time}${duration}`,
  };
  return jwt.sign(payload, ENV[NODE_ENV].jwt_secret, options);
};
