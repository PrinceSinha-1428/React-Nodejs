import { createUser, getUsers } from "@/controllers/user/user.controller";
import { isAuthenticated } from "@/middleware/auth/auth.middleware";
import { authorizeRoles } from "@/middleware/role/role.middleware";
import { validate } from "@/middleware/validation/validate.middleware";
import { createUserSchema } from "@/schema/create-user.schema";
import { Router } from "express";

const userRoutes = Router();

userRoutes.use(isAuthenticated);

userRoutes.get("/", authorizeRoles("Super Admin", "Admin"), getUsers);
userRoutes.post("/", authorizeRoles("Super Admin", "Admin"), validate(createUserSchema), createUser);

export default userRoutes;
