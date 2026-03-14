import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from "sequelize";
import { Role } from "@/@types";

export class User extends Model<
  InferAttributes<User>,
  InferCreationAttributes<User>
> {
  declare user_id: CreationOptional<string>;
  declare name: string;
  declare email: string;
  declare password: string;
  declare role: Role;
}

export const initUserModel = (sequelize: Sequelize) => {
  User.init(
    {
      user_id: {
        type: DataTypes.UUID,
        defaultValue: sequelize.literal(`NEWID()`),
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(128),
        allowNull: true,
      },
      role: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
          isIn: [["Super Admin", "Admin", "User"]],
        },
      },
      email: {
        type: DataTypes.STRING(128),
        allowNull: true,
      },
      password: {
        type: DataTypes.STRING(256),
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "Users",
      modelName: "Users",
      indexes: [
        {
          unique: true,
          fields: ["email"],
        },
      ],
    },
  );

  return User;
};
