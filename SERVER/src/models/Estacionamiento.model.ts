import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db";

class Estacionamiento extends Model {
  public id!: number;
  public nombre!: string;
  public direccion!: string;
  public capacidadTotal!: number;
  public cajonesDisponibles!: number;
  public cajonesOcupados!: number;
  public cajonesDiscapacitados!: number;
  public tarifaHora!: number;
  public tarifaMedia!: number;
  public tarifaDia!: number;
  public horarioApertura!: string;
  public horarioCierre!: string;
  public estado!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Estacionamiento.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "El nombre del estacionamiento no puede estar vacío",
        },
      },
    },
    direccion: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "La dirección no puede estar vacía",
        },
      },
    },
    capacidadTotal: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: {
          args: [0],
          msg: "La capacidad total debe ser mayor o igual a 0",
        },
      },
    },
    cajonesDisponibles: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: {
          args: [0],
          msg: "Los cajones disponibles deben ser mayor o igual a 0",
        },
      },
    },
    cajonesOcupados: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: {
          args: [0],
          msg: "Los cajones ocupados deben ser mayor o igual a 0",
        },
      },
    },
    cajonesDiscapacitados: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: {
          args: [0],
          msg: "Los cajones para discapacitados deben ser mayor o igual a 0",
        },
      },
    },
    tarifaHora: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 35.0,
      validate: {
        min: {
          args: [0],
          msg: "La tarifa por hora debe ser mayor o igual a 0",
        },
      },
    },
    tarifaMedia: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 20.0,
      validate: {
        min: {
          args: [0],
          msg: "La tarifa por media hora debe ser mayor o igual a 0",
        },
      },
    },
    tarifaDia: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 200.0,
      validate: {
        min: {
          args: [0],
          msg: "La tarifa por día debe ser mayor o igual a 0",
        },
      },
    },
    horarioApertura: {
      type: DataTypes.STRING(5),
      allowNull: false,
      defaultValue: '08:00',
      validate: {
        is: {
          args: /^([01]\d|2[0-3]):([0-5]\d)$/,
          msg: "El formato de horario debe ser HH:MM",
        },
      },
    },
    horarioCierre: {
      type: DataTypes.STRING(5),
      allowNull: false,
      defaultValue: '20:00',
      validate: {
        is: {
          args: /^([01]\d|2[0-3]):([0-5]\d)$/,
          msg: "El formato de horario debe ser HH:MM",
        },
      },
    },
    estado: {
      type: DataTypes.ENUM('abierto', 'cerrado', 'mantenimiento'),
      allowNull: false,
      defaultValue: 'abierto',
      validate: {
        isIn: {
          args: [['abierto', 'cerrado', 'mantenimiento']],
          msg: "El estado debe ser abierto, cerrado o mantenimiento",
        },
      },
    },
  },
  {
    sequelize,
    modelName: "Estacionamiento",
    tableName: "estacionamientos",
  }
);

export default Estacionamiento;
