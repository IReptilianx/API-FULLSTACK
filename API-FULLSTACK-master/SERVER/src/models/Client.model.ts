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
  public status?: string;
  public hours?: number;
  public price?: number;
  public spotId!: number;
  public startTime!: Date;
  public endTime?: Date;
  public isDisabled?: boolean;
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
    spotId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    hours: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'activo'
    },
    startTime: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    endTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    isDisabled: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
  },
  {
    sequelize,
    modelName: "Client",
    tableName: "clients",
  }
);

export default Client;