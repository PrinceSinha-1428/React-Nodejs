import { Router } from "express";
import authRoutes from "./auth/auth.route";
import userRoutes from "./user/user.route";

const apiRoutes = Router();

apiRoutes.use("/auth", authRoutes);
apiRoutes.use("/users", userRoutes);

export default apiRoutes;