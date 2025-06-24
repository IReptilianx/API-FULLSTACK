import { Request, Response } from "express";
import Usuario from "../models/Usuario.model";

// Registro de nuevo usuario
export const registerUser = async (req: Request, res: Response) => {
  try {
    const {
      nombreCompleto,
      apellido,
      direccion,
      email,
      password,
      telefono,
      rol,
      comoNosConocio,
      observaciones,
    } = req.body;

    // Verificar si el email ya existe
    const existingUser = await Usuario.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ 
        message: "El correo electrónico ya está registrado" 
      });
    }

    // Crear nuevo usuario sin hashear la contraseña
    const newUser = await Usuario.create({
      nombreCompleto,
      apellido,
      direccion,
      email,
      password, // Guardar la contraseña tal como se ingresa
      telefono,
      rol: rol || 'empleado', // Si no se proporciona rol, por defecto será 'empleado'
      comoNosConocio,
      observaciones,
    });

    res.status(201).json({ 
      message: "Usuario registrado exitosamente", 
      user: {
        id: newUser.get("id"),
        email: newUser.get("email"),
        nombreCompleto: newUser.get("nombreCompleto"),
      }
    });
  } catch (error: any) {
    console.error("Error al registrar usuario:", error);

    // Manejar errores de validación de Sequelize
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      const validationErrors = error.errors.map((err: any) => ({
        field: err.path,
        message: err.message
      }));
      
      return res.status(400).json({ 
        message: "Error de validación", 
        errors: validationErrors 
      });
    }

    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// Login de usuario
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    console.log("Login attempt:", { email, password });

    // Verificar credenciales de usuario registrado
    const user = await Usuario.findOne({ where: { email, password } }); // Comparar directamente email y password
    console.log("User found:", user ? { id: user.get("id"), email: user.get("email"), password: user.get("password") } : "No user found");

    if (!user) {
      console.log("Authentication failed - user not found or password mismatch");
      return res.status(401).json({ 
        success: false, 
        message: "Correo o contraseña incorrectos" 
      });
    }

    // Obtener el rol del usuario
    const userRole = user.get("rol") as string;

    res.json({ 
      success: true, 
      user: {
        id: user.get("id"),
        email: user.get("email"),
        nombreCompleto: user.get("nombreCompleto"),
        role: userRole // Enviar el rol real del usuario
      }
    });
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// Obtener todos los usuarios (solo para admin)
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await Usuario.findAll({
      attributes: ['id', 'nombreCompleto', 'apellido', 'email', 'password', 'telefono', 'createdAt']
    });
    res.json({ data: users });
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// Función temporal para consultar usuarios con contraseñas (solo para debug)
export const getAllUsersWithPasswords = async (req: Request, res: Response) => {
  try {
    const users = await Usuario.findAll({
      attributes: ['id', 'nombreCompleto', 'apellido', 'email', 'password', 'telefono', 'direccion', 'comoNosConocio', 'observaciones', 'createdAt'],
      order: [['createdAt', 'DESC']]
    });
    
    res.json({ 
      message: "Usuarios registrados:", 
      total: users.length,
      users: users 
    });
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// Eliminar un usuario (solo para admin)
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Verificar si el usuario existe
    const user = await Usuario.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    
    // Eliminar el usuario
    await user.destroy();
    
    res.json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
