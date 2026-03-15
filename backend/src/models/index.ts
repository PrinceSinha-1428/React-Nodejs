import { Sequelize } from "sequelize";
import { initUserModel, User } from "./user.model";
import { ENV, NODE_ENV } from "@/config/env.service";
import { initSessionModel, Session } from "./session.model";

interface Models {
  User: typeof User;
  Session: typeof Session;
}

interface DB {
  models: Models;
  sequelize: Sequelize;
  Sequelize: typeof Sequelize;
}

const sequelize = new Sequelize(
  ENV[NODE_ENV].DB_NAME,
  ENV[NODE_ENV].DB_USER,
  ENV[NODE_ENV].DB_PASSWORD,
  {
    host: ENV[NODE_ENV].DB_HOST,
    port: ENV[NODE_ENV].DB_PORT,
    dialect: "mssql",
    logging: false,
  },
);

const db: DB = {} as DB;

db.models = {
  User: initUserModel(sequelize),
  Session: initSessionModel(sequelize),
};

Object.keys(db.models).forEach((modelName) => {
  const model = db.models[modelName as keyof Models];
  if ("associate" in model && typeof model.associate === "function") {
    model.associate(db.models);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
