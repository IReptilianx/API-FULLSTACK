import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db";

// Definir la interfaz para los atributos del Usuario
interface UsuarioAttributes {
  id?: number;  // Cambiado a id para que Sequelize lo maneje correctamente
  nombreCompleto: string;
  apellido: string;
  direccion?: string;
  email: string;
  password: string;
  telefono: string;
  rol?: string;  // Nuevo campo para el rol (empleado o administrador)
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
    // Usamos la propiedad 'field' para mapear 'id' a 'id_usuario'
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: 'id_usuario', // Esto hace que el campo 'id' en el modelo se mapee a 'id_usuario' en la DB
    },
    nombreCompleto: {
      type: DataTypes.STRING,
      allowNull: false, // Campo obligatorio para nuevos registros
      validate: {
        notEmpty: {
          msg: "El nombre completo no puede estar vacío"
        },
        len: {
          args: [2, 20],
          msg: "El nombre debe tener entre 2 y 20 caracteres"
        },
        is: {
          args: /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$/,
          msg: "El nombre solo debe contener letras y espacios"
        }
      }
    },
    apellido: {
      type: DataTypes.STRING,
      allowNull: false, // Campo obligatorio para nuevos registros
      validate: {
        notEmpty: {
          msg: "El apellido no puede estar vacío"
        },
        len: {
          args: [2, 20],
          msg: "El apellido debe tener entre 2 y 20 caracteres"
        },
        is: {
          args: /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$/,
          msg: "El apellido solo debe contener letras y espacios"
        }
      }
    },
    direccion: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: {
          args: [0, 255],
          msg: "La dirección no debe exceder los 255 caracteres"
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // Debe ser boolean o string simple
      validate: {
        isEmail: {
          msg: "El formato del correo electrónico no es válido"
        },
        notEmpty: {
          msg: "El correo electrónico no puede estar vacío"
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "La contraseña no puede estar vacía"
        },
        len: {
          args: [8, 100],
          msg: "La contraseña debe tener al menos 8 caracteres"
        },
        is: {
          args: /^(?=.*[A-Z])(?=.*[0-9])/,
          msg: "La contraseña debe contener al menos una letra mayúscula y un número"
        }
      }
    },
    telefono: {
      type: DataTypes.STRING,
      allowNull: false, // Campo obligatorio para nuevos registros
      validate: {
        is: {
          args: /^[0-9]{10}$/,
          msg: "El teléfono debe tener exactamente 10 dígitos numéricos"
        },
        notEmpty: {
          msg: "El teléfono no puede estar vacío"
        }
      }
    },
    rol: {
      type: DataTypes.ENUM('empleado', 'administrador'),
      defaultValue: 'empleado',
      allowNull: false,
      validate: {
        isIn: {
          args: [['empleado', 'administrador']],
          msg: "El rol debe ser 'empleado' o 'administrador'"
        }
      }
    },
    comoNosConocio: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: {
          args: [0, 100],
          msg: "Este campo no debe exceder los 100 caracteres"
        }
      }
    },
    observaciones: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: {
          args: [0, 500],
          msg: "Las observaciones no deben exceder los 500 caracteres"
        }
      }
    },
  },
  {
    sequelize,
    modelName: "Usuario",
    tableName: "usuarios",
  }
);

export default Usuario;
