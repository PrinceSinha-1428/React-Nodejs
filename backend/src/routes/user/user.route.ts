import { createUser, deleteUser, getUserById, getUsers, updateUser } from "@/controllers/user/user.controller";
import { isAuthenticated } from "@/middleware/auth/auth.middleware";
import { authorizeRoles } from "@/middleware/role/role.middleware";
import { validate } from "@/middleware/validation/validate.middleware";
import { createUserSchema } from "@/schema/create-user.schema";
import { Router } from "express";

const userRoutes = Router();

userRoutes.use(isAuthenticated);

userRoutes.get("/", authorizeRoles("Super Admin", "Admin"), getUsers);
userRoutes.post("/", authorizeRoles("Super Admin", "Admin"), validate(createUserSchema), createUser);
userRoutes.put("/:id", authorizeRoles("Super Admin"), updateUser);
userRoutes.delete("/:id", authorizeRoles("Super Admin"), deleteUser);
userRoutes.get("/:id", authorizeRoles("Super Admin"), getUserById);

export default userRoutes;
