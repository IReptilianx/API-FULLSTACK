import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db";

class Client extends Model {
  public id!: number;
  public nombre!: string;
  public apellido!: string;
  public telefono!: string;
  public placas!: string;
  public auto!: string;
  public color!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Client.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    apellido: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    telefono: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    placas: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    auto: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    color: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Client",
    tableName: "clients",
  }
);

export default Client;