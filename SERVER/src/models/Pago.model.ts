import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db";
import Client from "./Client.model";

class Pago extends Model {
  public id!: number;
  public clienteId!: number;
  public monto!: number;
  public metodoPago!: string;
  public concepto!: string;
  public referencia!: string;
  public estado!: string;
  public readonly fechaPago!: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Pago.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
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
    },
    monto: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: {
          args: [0],
          msg: "El monto debe ser mayor o igual a 0",
        },
        notNull: {
          msg: "El monto es obligatorio",
        },
      },
    },
    metodoPago: {
      type: DataTypes.ENUM('efectivo', 'tarjeta', 'transferencia', 'otro'),
      allowNull: false,
      defaultValue: 'efectivo',
      validate: {
        isIn: {
          args: [['efectivo', 'tarjeta', 'transferencia', 'otro']],
          msg: "El método de pago debe ser válido",
        },
      },
    },
    concepto: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: 'Servicio de estacionamiento',
      validate: {
        notEmpty: {
          msg: "El concepto no puede estar vacío",
        },
      },
    },
    referencia: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    estado: {
      type: DataTypes.ENUM('pendiente', 'completado', 'cancelado'),
      allowNull: false,
      defaultValue: 'completado',
      validate: {
        isIn: {
          args: [['pendiente', 'completado', 'cancelado']],
          msg: "El estado debe ser pendiente, completado o cancelado",
        },
      },
    },
    fechaPago: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "Pago",
    tableName: "pagos",
  }
);

// Relación con Cliente
Pago.belongsTo(Client, { as: 'cliente', foreignKey: 'clienteId' });
Client.hasMany(Pago, { as: 'pagos', foreignKey: 'clienteId' });

export default Pago;
