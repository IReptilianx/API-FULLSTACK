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
  public status!: string;
  public isDisabled!: boolean;
  public hours!: number;
  public price!: number;
  public spotId!: number;
  public readonly startTime!: Date;
  public readonly endTime!: Date;
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
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "El nombre no puede estar vacío",
        },
        len: {
          args: [2, 20],
          msg: "El nombre debe tener entre 2 y 20 caracteres",
        },
        is: {
          args: /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$/,
          msg: "El nombre solo debe contener letras y espacios",
        },
      },
    },
    apellido: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "El apellido no puede estar vacío",
        },
        len: {
          args: [2, 20],
          msg: "El apellido debe tener entre 2 y 20 caracteres",
        },
        is: {
          args: /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$/,
          msg: "El apellido solo debe contener letras y espacios",
        },
      },
    },
    telefono: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        is: {
          args: /^[0-9]{10}$/,
          msg: "El teléfono debe tener exactamente 10 dígitos numéricos",
        },
        notEmpty: {
          msg: "El teléfono no puede estar vacío",
        },
      },
    },
    placas: {
      type: DataTypes.STRING(8),
      allowNull: false,
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
    auto: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "El tipo de auto no puede estar vacío",
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
    status: {
      type: DataTypes.ENUM('activo', 'finalizado'),
      defaultValue: 'activo',
      allowNull: false,
      validate: {
        isIn: {
          args: [['activo', 'finalizado']],
          msg: "El estado debe ser 'activo' o 'finalizado'"
        }
      }
    },
    hours: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 35
    },
    spotId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "El lugar de estacionamiento es obligatorio"
        }
      }
    },
    isDisabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    startTime: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    endTime: {
      type: DataTypes.DATE,
      allowNull: true
    }
  },
  {
    sequelize,
    modelName: "Client",
    tableName: "clients",
  }
);

export default Client;