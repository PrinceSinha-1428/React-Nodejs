import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from "sequelize";

export class Session extends Model<
  InferAttributes<Session>,
  InferCreationAttributes<Session>
> {
  declare session_id: CreationOptional<string>;
  declare user_id: string;
  declare refresh_token_hash: string;
  declare ip: string;
  declare user_agent: string;
  declare revoked: boolean;

  static associate(models: any) {
    Session.belongsTo(models.User, {
      foreignKey: "user_id",
      as: "user",
    });
  }
}

export const initSessionModel = (sequelize: Sequelize) => {
  Session.init(
    {
      session_id: {
        type: DataTypes.UUID,
        defaultValue: sequelize.literal(`NEWID()`),
        allowNull: false,
        primaryKey: true,
      },
      user_id: {
         type: DataTypes.UUID,
         allowNull: false,
         references: { model: "Users", key: "user_id" },
         onDelete: "CASCADE", 
       },

      refresh_token_hash: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      ip: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      user_agent: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      revoked: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "Session",
      modelName: "Session",
    },
  );
  return Session;
};
