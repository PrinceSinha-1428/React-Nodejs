import { Sequelize } from "sequelize";
import { initUserModel, User } from "./user.model";
import { ENV, NODE_ENV } from "@/config/env.environment";

interface Models {
   User: typeof User
}

interface DB {
   models: Models,
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
  }
);

const db: DB = {} as DB;

db.models = {
  User: initUserModel(sequelize),
};

Object.keys(db.models).forEach((modelName) => {
  if (db.models[modelName].associate) {
    db.models[modelName].associate(db.models);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;