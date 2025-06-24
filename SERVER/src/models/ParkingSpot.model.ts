import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db";

class ParkingSpot extends Model {
  public id!: number;
  public occupied!: boolean;
  public isDisabledOnly!: boolean;
}

ParkingSpot.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    occupied: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    isDisabledOnly: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    }
  },
  {
    sequelize,
    modelName: "ParkingSpot",
    tableName: "parking_spots",
    timestamps: false,
  }
);

export default ParkingSpot;
