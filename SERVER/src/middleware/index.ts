import { Request, Response, NextFunction } from 'express';
import { validationResult } from "express-validator";
import Usuario from "../models/Usuario.model";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: string;
  };
}

export const handleInputErrors = (req: Request, res: Response, next: NextFunction): void => {
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
  } else {
    next();
  }
};

// Middleware para verificar que el usuario está autenticado
export const isAuthenticated = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  // Normalmente usaríamos token JWT, pero para simplificar podemos usar el ID de usuario en el cuerpo
  const userId = req.body.userId || req.query.userId || req.headers['x-user-id'];
  
  if (!userId) {
    res.status(401).json({ message: "No está autenticado" });
    return;
  }

  try {
    const user = await Usuario.findByPk(userId);
    if (!user) {
      res.status(401).json({ message: "Usuario no encontrado" });
      return;
    }

    // Añadir el usuario al objeto request
    req.user = {
      id: user.get('id') as number,
      email: user.get('email') as string,
      role: user.get('rol') as string
    };
    
    next();
  } catch (error) {
    console.error('Error en autenticación:', error);
    res.status(500).json({ message: "Error en la autenticación" });
  }
};

// Middleware para verificar que el usuario es administrador
export const isAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.status(401).json({ message: "No está autenticado" });
    return;
  }

  if (req.user.role !== 'administrador') {
    res.status(403).json({ message: "Acceso denegado: Se requieren privilegios de administrador" });
    return;
  }

  next();
};