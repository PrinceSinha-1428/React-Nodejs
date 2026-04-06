import path from "path";
import express, { Express } from "express";
import cookieParser from "cookie-parser";
import apiRoutes from "./routes/apiRoutes.route";
import { ENV, NODE_ENV } from "./config/env.service";
import { checkDBService } from "./middleware/db/db.middleware";
import db from "./models";
import { ipRestriction } from "./middleware/ip/ip.middleware";
import { connectDB } from "./config/db.service";

const app: Express = express();

app.set("trust proxy", true);
app.use(ipRestriction);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.get("/ip-check", (_req, res) => {
  res.sendStatus(200);
});

const startServer = async () => {
  await connectDB();
  await db.sequelize.sync({ alter: true });

  app.use("/api", checkDBService, apiRoutes);
  if (NODE_ENV === "development") {
    const { createServer: viteServer } = await import("vite");
    const frontendPath = path.join(process.cwd(), "../frontend");
    const vite = await viteServer({
      root: frontendPath,
      server: { middlewareMode: true },
    });

    app.use(vite.middlewares);
  }
  app.listen(ENV[NODE_ENV].port, "0.0.0.0", async () => {
    console.log(`Server is running at http://localhost:${ENV[NODE_ENV].port}`);
  });
};
startServer();
export default app;
