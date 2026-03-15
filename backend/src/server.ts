import path from "path";
import express, { Express } from "express";
import cookieParser from "cookie-parser";
import apiRoutes from "./routes/apiRoutes.route";
import { ENV, NODE_ENV } from "./config/env.service";
import { createServer as viteServer } from "vite";
import { checkDBService } from "./middleware/db/db.middleware";
import db from "./models";

const app: Express = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

const frontendPath = path.join(__dirname, "../../frontend");

const startServer = async () => {
  await db.sequelize.sync({ alter: true });

  app.use(checkDBService);
  const vite = await viteServer({
    root: frontendPath,
    server: { middlewareMode: true },
  });

  app.use("/api", apiRoutes);
  app.use(vite.middlewares);
  app.listen(ENV[NODE_ENV].port, async () => {
    console.log(`Server is running at http://localhost:${ENV[NODE_ENV].port}`);
  });
};
startServer();
export default app;
