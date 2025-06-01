import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db";

class Product extends Model {
  public id!: number;
  public name!: string;
  public price!: string;
  public disponibility!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Product.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    price: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    disponibility: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: "Product",
    tableName: "product",
  }
);

export default Product;