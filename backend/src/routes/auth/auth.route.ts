import { signIn, logout } from "@/controllers/auth/auth.controller";
import { validate } from "@/middleware/validation/validate.middleware";
import { loginSchema } from "@/schema/login.schema";
import { Router } from "express";

const authRoutes = Router();

authRoutes.post("/sign-in", [validate(loginSchema), signIn]);
authRoutes.get("/logout", [logout]);

export default authRoutes;
