import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db";
import Client from "./Client.model";

class Auto extends Model {
  public id!: number;
  public marca!: string;
  public modelo!: string;
  public ano!: number;
  public placas!: string;
  public color!: string;
  public tipo!: string;
  public clienteId!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Auto.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    marca: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "La marca no puede estar vacía",
        },
      },
    },
    modelo: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "El modelo no puede estar vacío",
        },
      },
    },
    ano: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: {
          msg: "El año debe ser un número entero",
        },
        min: {
          args: [1900],
          msg: "El año debe ser al menos 1900",
        },
        max: {
          args: [new Date().getFullYear() + 1],
          msg: "El año no puede ser mayor al próximo año",
        },
      },
    },
    placas: {
      type: DataTypes.STRING(8),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: {
          msg: "Las placas no pueden estar vacías",
        },
        is: {
          args: /^\d{3}-[A-Z]{3}$/,
          msg: "Las placas deben tener el formato 123-ABC (3 números, guion, 3 letras mayúsculas)",
        },
      },
    },
    color: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "El color no puede estar vacío",
        },
        is: {
          args: /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$/,
          msg: "El color solo debe contener letras y espacios",
        },
      },
    },
    tipo: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "El tipo de auto no puede estar vacío",
        },
      },
    },
    clienteId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'clients',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    }
  },
  {
    sequelize,
    modelName: "Auto",
    tableName: "autos",
  }
);

// Relación con Cliente
Auto.belongsTo(Client, { as: 'cliente', foreignKey: 'clienteId' });
Client.hasMany(Auto, { as: 'autos', foreignKey: 'clienteId' });

export default Auto;
