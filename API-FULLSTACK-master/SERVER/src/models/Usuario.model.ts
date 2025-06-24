import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db";

// Definir la interfaz para los atributos del Usuario
interface UsuarioAttributes {
  id_usuario?: number;
  nombreCompleto: string;
  apellido: string;
  direccion?: string;
  email: string;
  password: string;
  telefono: string;
  comoNosConocio?: string;
  observaciones?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

class Usuario extends Model<UsuarioAttributes> {
  // Los campos públicos se eliminan para evitar conflictos con Sequelize
}

Usuario.init(
  {
    id_usuario: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nombreCompleto: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    apellido: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    direccion: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    telefono: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    comoNosConocio: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    observaciones: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Usuario",
    tableName: "usuarios",
  }
);

export default Usuario;
