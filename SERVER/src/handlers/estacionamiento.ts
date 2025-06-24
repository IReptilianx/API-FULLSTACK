import { Request, Response } from 'express';
import { Estacionamiento, Cajon } from '../models';
import { validationResult } from 'express-validator';

// Obtener todos los estacionamientos
export const getAllEstacionamientos = async (req: Request, res: Response) => {
  try {
    const estacionamientos = await Estacionamiento.findAll({
      order: [['id', 'ASC']]
    });
    
    return res.status(200).json({
      success: true,
      message: 'Estacionamientos obtenidos correctamente',
      data: estacionamientos
    });
  } catch (error) {
    console.error('Error al obtener estacionamientos:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener los estacionamientos',
      error: (error as Error).message
    });
  }
};

// Obtener un estacionamiento por ID
export const getEstacionamientoById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const estacionamiento = await Estacionamiento.findByPk(id, {
      include: [{ association: 'cajones' }]
    });
    
    if (!estacionamiento) {
      return res.status(404).json({
        success: false,
        message: `Estacionamiento con ID ${id} no encontrado`
      });
    }
    
    return res.status(200).json({
      success: true,
      message: 'Estacionamiento obtenido correctamente',
      data: estacionamiento
    });
  } catch (error) {
    console.error('Error al obtener estacionamiento por ID:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener el estacionamiento',
      error: (error as Error).message
    });
  }
};

// Crear un nuevo estacionamiento
export const createEstacionamiento = async (req: Request, res: Response) => {
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
    
    const estacionamientoData = req.body;
    const newEstacionamiento = await Estacionamiento.create(estacionamientoData);
    
    // Si se proporcionó capacidad total, crear los cajones
    if (estacionamientoData.capacidadTotal > 0) {
      const cajonesPromises = [];
      
      for (let i = 1; i <= estacionamientoData.capacidadTotal; i++) {
        cajonesPromises.push(Cajon.create({
          numero: i,
          estado: 'disponible',
          esDiscapacitado: i % 10 === 0, // Cada décimo cajón es para discapacitados
          localizacion: i <= estacionamientoData.capacidadTotal / 2 ? 'Planta Baja' : 'Primer Piso',
          estacionamientoId: newEstacionamiento.id,
          parkingSpotId: i // Asociar con el parking spot existente (debe existir previamente)
        }));
      }
      
      await Promise.all(cajonesPromises);
    }
    
    return res.status(201).json({
      success: true,
      message: 'Estacionamiento creado correctamente',
      data: newEstacionamiento
    });
  } catch (error) {
    console.error('Error al crear estacionamiento:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al crear el estacionamiento',
      error: (error as Error).message
    });
  }
};

// Actualizar un estacionamiento
export const updateEstacionamiento = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const estacionamientoData = req.body;
    
    // Validar request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Error de validación',
        errors: errors.array()
      });
    }
    
    // Verificar si el estacionamiento existe
    const estacionamiento = await Estacionamiento.findByPk(id);
    if (!estacionamiento) {
      return res.status(404).json({
        success: false,
        message: `Estacionamiento con ID ${id} no encontrado`
      });
    }
    
    // Actualizar
    await estacionamiento.update(estacionamientoData);
    
    return res.status(200).json({
      success: true,
      message: 'Estacionamiento actualizado correctamente',
      data: estacionamiento
    });
  } catch (error) {
    console.error('Error al actualizar estacionamiento:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al actualizar el estacionamiento',
      error: (error as Error).message
    });
  }
};

// Eliminar un estacionamiento
export const deleteEstacionamiento = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Verificar si el estacionamiento existe
    const estacionamiento = await Estacionamiento.findByPk(id);
    if (!estacionamiento) {
      return res.status(404).json({
        success: false,
        message: `Estacionamiento con ID ${id} no encontrado`
      });
    }
    
    // Eliminar (esto también eliminará los cajones asociados debido a la regla CASCADE)
    await estacionamiento.destroy();
    
    return res.status(200).json({
      success: true,
      message: 'Estacionamiento eliminado correctamente',
      data: { id }
    });
  } catch (error) {
    console.error('Error al eliminar estacionamiento:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al eliminar el estacionamiento',
      error: (error as Error).message
    });
  }
};

// Obtener estadísticas del estacionamiento
export const getEstacionamientoStats = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Verificar si el estacionamiento existe
    const estacionamiento = await Estacionamiento.findByPk(id);
    if (!estacionamiento) {
      return res.status(404).json({
        success: false,
        message: `Estacionamiento con ID ${id} no encontrado`
      });
    }
    
    // Obtener estadísticas de los cajones
    const cajones = await Cajon.findAll({
      where: { estacionamientoId: id }
    });
    
    const stats = {
      total: cajones.length,
      disponibles: cajones.filter(c => c.estado === 'disponible').length,
      ocupados: cajones.filter(c => c.estado === 'ocupado').length,
      mantenimiento: cajones.filter(c => c.estado === 'mantenimiento').length,
      reservados: cajones.filter(c => c.estado === 'reservado').length,
      discapacitados: cajones.filter(c => c.esDiscapacitado).length,
      discapacitadosDisponibles: cajones.filter(c => c.esDiscapacitado && c.estado === 'disponible').length,
    };
    
    return res.status(200).json({
      success: true,
      message: 'Estadísticas del estacionamiento obtenidas correctamente',
      data: stats
    });
  } catch (error) {
    console.error('Error al obtener estadísticas del estacionamiento:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener las estadísticas del estacionamiento',
      error: (error as Error).message
    });
  }
};
