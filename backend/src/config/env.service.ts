import dotenv from  "dotenv";
import path from "path";

dotenv.config({
  path: path.join(__dirname, "../../../.env"),
  quiet: true,
});


type Environment = "development" | "production";
interface EnvConfig {
   port: number;
   jwt_secret: string;
   DB_NAME: string;
   DB_HOST: string;
   DB_USER: string;
   DB_PASSWORD: string;
   DB_PORT: number;
   ENABLE_IP_RESTRICTION: string;
};

export const NODE_ENV = process.env.NODE_ENV === "production" ? "production" : "development";


export const ENV: Record<Environment, EnvConfig> = {
  development: {
    port: Number(process.env.PORT) ?? 3000,
    jwt_secret: process.env.JWT_SECRET ? process.env.JWT_SECRET : "BECBEUICB",
    DB_NAME: process.env.DB_NAME!,
    DB_HOST: process.env.DB_HOST!,
    DB_USER: process.env.DB_USER!,
    DB_PASSWORD: process.env.DB_PASSWORD!,
    DB_PORT: Number(process.env.DB_PORT!),
    ENABLE_IP_RESTRICTION: process.env.ENABLE_IP_RESTRICTION!
  },
  production: {
    port: Number(process.env.PORT) ?? 8080,
    jwt_secret: process.env.JWT_SECRET ? process.env.JWT_SECRET : "VVDUY3DY3",
    DB_NAME: process.env.DB_NAME!,
    DB_HOST: process.env.DB_HOST!,
    DB_USER: process.env.DB_USER!,
    DB_PASSWORD: process.env.DB_PASSWORD!,
    DB_PORT: Number(process.env.DB_PORT!),
    ENABLE_IP_RESTRICTION: process.env.ENABLE_IP_RESTRICTION!

  },
};