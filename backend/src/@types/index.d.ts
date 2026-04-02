import { User } from "@/models/user.model";
import "express";

export type Role = "Super Admin" | "Admin" | "User";

declare module "express" {
  export interface Request {
    user?: User;
    clientIp?: string;
  }
}
