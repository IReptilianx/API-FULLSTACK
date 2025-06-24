import { Request, Response } from 'express';
import { Pago } from '../models';
import { validationResult } from 'express-validator';

// Obtener todos los pagos
export const getAllPagos = async (req: Request, res: Response) => {
  try {
    const pagos = await Pago.findAll({
      order: [['id', 'DESC']]
    });
    
    return res.status(200).json({
      success: true,
      message: 'Pagos obtenidos correctamente',
      data: pagos
    });
  } catch (error) {
    console.error('Error al obtener pagos:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener los pagos',
      error: (error as Error).message
    });
  }
};

// Obtener un pago por ID
export const getPagoById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const pago = await Pago.findByPk(id);
    
    if (!pago) {
      return res.status(404).json({
        success: false,
        message: `Pago con ID ${id} no encontrado`
      });
    }
    
    return res.status(200).json({
      success: true,
      message: 'Pago obtenido correctamente',
      data: pago
    });
  } catch (error) {
    console.error('Error al obtener pago por ID:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener el pago',
      error: (error as Error).message
    });
  }
};

// Crear un nuevo pago
export const createPago = async (req: Request, res: Response) => {
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
    
    const pagoData = req.body;
    const newPago = await Pago.create(pagoData);
    
    return res.status(201).json({
      success: true,
      message: 'Pago registrado correctamente',
      data: newPago
    });
  } catch (error) {
    console.error('Error al crear pago:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al registrar el pago',
      error: (error as Error).message
    });
  }
};

// Actualizar un pago
export const updatePago = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const pagoData = req.body;
    
    // Validar request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Error de validación',
        errors: errors.array()
      });
    }
    
    // Verificar si el pago existe
    const pago = await Pago.findByPk(id);
    if (!pago) {
      return res.status(404).json({
        success: false,
        message: `Pago con ID ${id} no encontrado`
      });
    }
    
    // Actualizar
    await pago.update(pagoData);
    
    return res.status(200).json({
      success: true,
      message: 'Pago actualizado correctamente',
      data: pago
    });
  } catch (error) {
    console.error('Error al actualizar pago:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al actualizar el pago',
      error: (error as Error).message
    });
  }
};

// Eliminar un pago
export const deletePago = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Verificar si el pago existe
    const pago = await Pago.findByPk(id);
    if (!pago) {
      return res.status(404).json({
        success: false,
        message: `Pago con ID ${id} no encontrado`
      });
    }
    
    // Eliminar
    await pago.destroy();
    
    return res.status(200).json({
      success: true,
      message: 'Pago eliminado correctamente',
      data: { id }
    });
  } catch (error) {
    console.error('Error al eliminar pago:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al eliminar el pago',
      error: (error as Error).message
    });
  }
};

// Obtener pagos por cliente
export const getPagosByClientId = async (req: Request, res: Response) => {
  try {
    const { clienteId } = req.params;
    
    const pagos = await Pago.findAll({
      where: { clienteId },
      order: [['fechaPago', 'DESC']]
    });
    
    return res.status(200).json({
      success: true,
      message: 'Pagos del cliente obtenidos correctamente',
      data: pagos
    });
  } catch (error) {
    console.error('Error al obtener pagos del cliente:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener los pagos del cliente',
      error: (error as Error).message
    });
  }
};

// Obtener pagos por fecha
export const getPagosByDate = async (req: Request, res: Response) => {
  try {
    const { fechaInicio, fechaFin } = req.query;
    
    if (!fechaInicio || !fechaFin) {
      return res.status(400).json({
        success: false,
        message: 'Debe proporcionar fechaInicio y fechaFin'
      });
    }
    
    const pagos = await Pago.findAll({
      where: {
        fechaPago: {
          [Symbol.for('gte')]: fechaInicio,
          [Symbol.for('lte')]: fechaFin,
        }
      },
      order: [['fechaPago', 'DESC']]
    });
    
    return res.status(200).json({
      success: true,
      message: 'Pagos por fecha obtenidos correctamente',
      data: pagos
    });
  } catch (error) {
    console.error('Error al obtener pagos por fecha:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener los pagos por fecha',
      error: (error as Error).message
    });
  }
};
