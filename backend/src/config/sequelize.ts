import { Sequelize } from "sequelize";
import { ENV, NODE_ENV } from "./env.environment";

export const sequelize =  new Sequelize(
   ENV[NODE_ENV].DB_NAME,
   ENV[NODE_ENV].DB_USER,
   ENV[NODE_ENV].DB_PASSWORD,
   {
      host: ENV[NODE_ENV].DB_HOST,
      port: ENV[NODE_ENV].DB_PORT,
      dialect: "mssql",
      logging: console.log
   }
)