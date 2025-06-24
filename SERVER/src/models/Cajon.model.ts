import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db";
import Client from "./Client.model";
import Auto from "./Auto.model";
import Estacionamiento from "./Estacionamiento.model";
import ParkingSpot from "./ParkingSpot.model";

class Cajon extends Model {
  public id!: number;
  public numero!: number;
  public estado!: string;
  public esDiscapacitado!: boolean;
  public localizacion!: string;
  public estacionamientoId!: number;
  public clienteId!: number | null;
  public autoId!: number | null;
  public parkingSpotId!: number;
  public horaEntrada!: Date | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Cajon.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    numero: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: {
          args: [1],
          msg: "El número de cajón debe ser mayor o igual a 1",
        },
      },
    },
    estado: {
      type: DataTypes.ENUM('disponible', 'ocupado', 'mantenimiento', 'reservado'),
      allowNull: false,
      defaultValue: 'disponible',
      validate: {
        isIn: {
          args: [['disponible', 'ocupado', 'mantenimiento', 'reservado']],
          msg: "El estado debe ser disponible, ocupado, mantenimiento o reservado",
        },
      },
    },
    esDiscapacitado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    localizacion: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'General',
      comment: 'Zona o sección del estacionamiento donde se encuentra el cajón',
    },
    estacionamientoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'estacionamientos',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    clienteId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'clients',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
    autoId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'autos',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
    parkingSpotId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'parking_spots',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      comment: 'Relacionado con el modelo legacy ParkingSpot',
    },
    horaEntrada: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Cajon",
    tableName: "cajones",
    indexes: [
      {
        unique: true,
        fields: ['numero', 'estacionamientoId']
      },
    ]
  }
);

// Relaciones
Cajon.belongsTo(Estacionamiento, { as: 'estacionamiento', foreignKey: 'estacionamientoId' });
Estacionamiento.hasMany(Cajon, { as: 'cajones', foreignKey: 'estacionamientoId' });

Cajon.belongsTo(Client, { as: 'cliente', foreignKey: 'clienteId' });
Client.hasMany(Cajon, { as: 'cajones', foreignKey: 'clienteId' });

Cajon.belongsTo(Auto, { as: 'auto', foreignKey: 'autoId' });
Auto.hasMany(Cajon, { as: 'cajones', foreignKey: 'autoId' });

Cajon.belongsTo(ParkingSpot, { as: 'parkingSpot', foreignKey: 'parkingSpotId' });
ParkingSpot.hasOne(Cajon, { as: 'cajon', foreignKey: 'parkingSpotId' });

export default Cajon;
