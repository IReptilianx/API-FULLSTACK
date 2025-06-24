import { Request, Response } from 'express';
import { Auto } from '../models';
import { validationResult } from 'express-validator';

// Obtener todos los autos
export const getAllAutos = async (req: Request, res: Response) => {
  try {
    const autos = await Auto.findAll({
      order: [['id', 'ASC']]
    });
    
    return res.status(200).json({
      success: true,
      message: 'Autos obtenidos correctamente',
      data: autos
    });
  } catch (error) {
    console.error('Error al obtener autos:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener los autos',
      error: (error as Error).message
    });
  }
};

// Obtener un auto por ID
export const getAutoById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const auto = await Auto.findByPk(id);
    
    if (!auto) {
      return res.status(404).json({
        success: false,
        message: `Auto con ID ${id} no encontrado`
      });
    }
    
    return res.status(200).json({
      success: true,
      message: 'Auto obtenido correctamente',
      data: auto
    });
  } catch (error) {
    console.error('Error al obtener auto por ID:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener el auto',
      error: (error as Error).message
    });
  }
};

// Crear un nuevo auto
export const createAuto = async (req: Request, res: Response) => {
  try {
    // Validar request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Error de validación',
        errors: errors.array()
      });
    }
    
    const autoData = req.body;
    
    // Comprobar si ya existe un auto con esas placas
    const existingAuto = await Auto.findOne({
      where: { placas: autoData.placas }
    });
    
    if (existingAuto) {
      return res.status(400).json({
        success: false,
        message: `Ya existe un auto con las placas ${autoData.placas}`
      });
    }
    
    const newAuto = await Auto.create(autoData);
    
    return res.status(201).json({
      success: true,
      message: 'Auto creado correctamente',
      data: newAuto
    });
  } catch (error) {
    console.error('Error al crear auto:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al crear el auto',
      error: (error as Error).message
    });
  }
};

// Actualizar un auto
export const updateAuto = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const autoData = req.body;
    
    // Validar request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Error de validación',
        errors: errors.array()
      });
    }
    
    // Verificar si el auto existe
    const auto = await Auto.findByPk(id);
    if (!auto) {
      return res.status(404).json({
        success: false,
        message: `Auto con ID ${id} no encontrado`
      });
    }
    
    // Si están cambiando las placas, verificar que no exista otro con esas placas
    if (autoData.placas && autoData.placas !== auto.placas) {
      const existingAuto = await Auto.findOne({
        where: { placas: autoData.placas }
      });
      
      if (existingAuto) {
        return res.status(400).json({
          success: false,
          message: `Ya existe un auto con las placas ${autoData.placas}`
        });
      }
    }
    
    // Actualizar
    await auto.update(autoData);
    
    return res.status(200).json({
      success: true,
      message: 'Auto actualizado correctamente',
      data: auto
    });
  } catch (error) {
    console.error('Error al actualizar auto:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al actualizar el auto',
      error: (error as Error).message
    });
  }
};

// Eliminar un auto
export const deleteAuto = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Verificar si el auto existe
    const auto = await Auto.findByPk(id);
    if (!auto) {
      return res.status(404).json({
        success: false,
        message: `Auto con ID ${id} no encontrado`
      });
    }
    
    // Eliminar
    await auto.destroy();
    
    return res.status(200).json({
      success: true,
      message: 'Auto eliminado correctamente',
      data: { id }
    });
  } catch (error) {
    console.error('Error al eliminar auto:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al eliminar el auto',
      error: (error as Error).message
    });
  }
};

// Obtener autos por cliente
export const getAutosByClientId = async (req: Request, res: Response) => {
  try {
    const { clienteId } = req.params;
    
    const autos = await Auto.findAll({
      where: { clienteId },
      order: [['id', 'ASC']]
    });
    
    return res.status(200).json({
      success: true,
      message: 'Autos del cliente obtenidos correctamente',
      data: autos
    });
  } catch (error) {
    console.error('Error al obtener autos del cliente:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener los autos del cliente',
      error: (error as Error).message
    });
  }
};
