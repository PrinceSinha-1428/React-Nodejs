import { signIn, logout, signUp, refreshToken } from "@/controllers/auth/auth.controller";
import { validate } from "@/middleware/validation/validate.middleware";
import { createUserSchema } from "@/schema/create-user.schema";
import { loginSchema } from "@/schema/login.schema";
import { Router } from "express";

const authRoutes = Router();

authRoutes.post("/sign-in", [validate(loginSchema), signIn]);
authRoutes.post("/sign-up", [validate(createUserSchema), signUp]);
authRoutes.get("/logout", [logout]);
authRoutes.get("/refresh", [refreshToken]);


export default authRoutes;
