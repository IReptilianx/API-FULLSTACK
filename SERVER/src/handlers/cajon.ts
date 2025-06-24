import { Request, Response } from 'express';
import { Cajon, Client, Auto } from '../models';
import { validationResult } from 'express-validator';

// Obtener todos los cajones
export const getAllCajones = async (req: Request, res: Response) => {
  try {
    const cajones = await Cajon.findAll({
      order: [['numero', 'ASC']],
      include: [
        { association: 'cliente' },
        { association: 'auto' }
      ]
    });
    
    return res.status(200).json({
      success: true,
      message: 'Cajones obtenidos correctamente',
      data: cajones
    });
  } catch (error) {
    console.error('Error al obtener cajones:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener los cajones',
      error: (error as Error).message
    });
  }
};

// Obtener un cajón por ID
export const getCajonById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const cajon = await Cajon.findByPk(id, {
      include: [
        { association: 'cliente' },
        { association: 'auto' }
      ]
    });
    
    if (!cajon) {
      return res.status(404).json({
        success: false,
        message: `Cajón con ID ${id} no encontrado`
      });
    }
    
    return res.status(200).json({
      success: true,
      message: 'Cajón obtenido correctamente',
      data: cajon
    });
  } catch (error) {
    console.error('Error al obtener cajón por ID:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener el cajón',
      error: (error as Error).message
    });
  }
};

// Crear un nuevo cajón
export const createCajon = async (req: Request, res: Response) => {
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
    
    const cajonData = req.body;
    
    // Verificar que no exista un cajón con el mismo número en el mismo estacionamiento
    const existingCajon = await Cajon.findOne({
      where: { 
        numero: cajonData.numero, 
        estacionamientoId: cajonData.estacionamientoId 
      }
    });
    
    if (existingCajon) {
      return res.status(400).json({
        success: false,
        message: `Ya existe un cajón con el número ${cajonData.numero} en este estacionamiento`
      });
    }
    
    const newCajon = await Cajon.create(cajonData);
    
    return res.status(201).json({
      success: true,
      message: 'Cajón creado correctamente',
      data: newCajon
    });
  } catch (error) {
    console.error('Error al crear cajón:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al crear el cajón',
      error: (error as Error).message
    });
  }
};

// Actualizar un cajón
export const updateCajon = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const cajonData = req.body;
    
    // Validar request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Error de validación',
        errors: errors.array()
      });
    }
    
    // Verificar si el cajón existe
    const cajon = await Cajon.findByPk(id);
    if (!cajon) {
      return res.status(404).json({
        success: false,
        message: `Cajón con ID ${id} no encontrado`
      });
    }
    
    // Si están cambiando el número, verificar que no exista otro con ese número
    if (cajonData.numero && cajonData.numero !== cajon.numero) {
      const existingCajon = await Cajon.findOne({
        where: { 
          numero: cajonData.numero, 
          estacionamientoId: cajonData.estacionamientoId || cajon.estacionamientoId 
        }
      });
      
      if (existingCajon) {
        return res.status(400).json({
          success: false,
          message: `Ya existe un cajón con el número ${cajonData.numero} en este estacionamiento`
        });
      }
    }
    
    // Actualizar
    await cajon.update(cajonData);
    
    return res.status(200).json({
      success: true,
      message: 'Cajón actualizado correctamente',
      data: cajon
    });
  } catch (error) {
    console.error('Error al actualizar cajón:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al actualizar el cajón',
      error: (error as Error).message
    });
  }
};

// Eliminar un cajón
export const deleteCajon = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Verificar si el cajón existe
    const cajon = await Cajon.findByPk(id);
    if (!cajon) {
      return res.status(404).json({
        success: false,
        message: `Cajón con ID ${id} no encontrado`
      });
    }
    
    // Eliminar
    await cajon.destroy();
    
    return res.status(200).json({
      success: true,
      message: 'Cajón eliminado correctamente',
      data: { id }
    });
  } catch (error) {
    console.error('Error al eliminar cajón:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al eliminar el cajón',
      error: (error as Error).message
    });
  }
};

// Asignar cajón a un cliente
export const assignCajonToClient = async (req: Request, res: Response) => {
  try {
    const { cajonId } = req.params;
    const { clienteId, autoId } = req.body;
    
    // Validar datos
    if (!clienteId || !autoId) {
      return res.status(400).json({
        success: false,
        message: 'Se requieren clienteId y autoId'
      });
    }
    
    // Verificar si existe el cajón
    const cajon = await Cajon.findByPk(cajonId);
    if (!cajon) {
      return res.status(404).json({
        success: false,
        message: `Cajón con ID ${cajonId} no encontrado`
      });
    }
    
    // Verificar si el cajón está disponible
    if (cajon.estado !== 'disponible') {
      return res.status(400).json({
        success: false,
        message: `El cajón ${cajon.numero} no está disponible actualmente (Estado: ${cajon.estado})`
      });
    }
    
    // Verificar si existe el cliente
    const cliente = await Client.findByPk(clienteId);
    if (!cliente) {
      return res.status(404).json({
        success: false,
        message: `Cliente con ID ${clienteId} no encontrado`
      });
    }
    
    // Verificar si existe el auto
    const auto = await Auto.findByPk(autoId);
    if (!auto) {
      return res.status(404).json({
        success: false,
        message: `Auto con ID ${autoId} no encontrado`
      });
    }
    
    // Actualizar el cajón
    await cajon.update({
      clienteId,
      autoId,
      estado: 'ocupado',
      horaEntrada: new Date()
    });    // Actualizar el parkingSpot asociado usando el ID directamente
    const parkingSpotId = cajon.parkingSpotId;
    if (parkingSpotId) {
      const { ParkingSpot } = await import('../models/index.js');
      const spotInstance = await ParkingSpot.findByPk(parkingSpotId);
      if (spotInstance) {
        await spotInstance.update({ occupied: true });
      }
    }
    
    return res.status(200).json({
      success: true,
      message: 'Cajón asignado correctamente',
      data: cajon
    });
  } catch (error) {
    console.error('Error al asignar cajón:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al asignar el cajón',
      error: (error as Error).message
    });
  }
};

// Liberar cajón
export const releaseCajon = async (req: Request, res: Response) => {
  try {
    const { cajonId } = req.params;
    
    // Verificar si existe el cajón
    const cajon = await Cajon.findByPk(cajonId, {
      include: [
        { association: 'cliente' },
        { association: 'auto' }
      ]
    });
    if (!cajon) {
      return res.status(404).json({
        success: false,
        message: `Cajón con ID ${cajonId} no encontrado`
      });
    }
    
    // Verificar si el cajón está ocupado
    if (cajon.estado !== 'ocupado') {
      return res.status(400).json({
        success: false,
        message: `El cajón ${cajon.numero} no está ocupado actualmente (Estado: ${cajon.estado})`
      });
    }
    
    // Guardar los datos antes de liberar
    const clienteId = cajon.clienteId;
    const autoId = cajon.autoId;
    const horaEntrada = cajon.horaEntrada;
    
    // Actualizar el cajón
    await cajon.update({
      clienteId: null,
      autoId: null,
      estado: 'disponible',
      horaEntrada: null
    });    // Actualizar el parkingSpot asociado usando el ID directamente
    const parkingSpotId = cajon.parkingSpotId;
    if (parkingSpotId) {
      const { ParkingSpot } = await import('../models/index.js');
      const spotInstance = await ParkingSpot.findByPk(parkingSpotId);
      if (spotInstance) {
        await spotInstance.update({ occupied: false });
      }
    }
    
    // Calcular el tiempo ocupado
    const tiempoOcupado = horaEntrada ? Math.ceil((new Date().getTime() - horaEntrada.getTime()) / (1000 * 60 * 60)) : 0;
    
    return res.status(200).json({
      success: true,
      message: 'Cajón liberado correctamente',
      data: {
        cajon,
        clienteId,
        autoId,
        horaEntrada,
        horaSalida: new Date(),
        tiempoOcupadoHoras: tiempoOcupado
      }
    });
  } catch (error) {
    console.error('Error al liberar cajón:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al liberar el cajón',
      error: (error as Error).message
    });
  }
};

// Obtener cajones por estacionamiento
export const getCajonesByEstacionamiento = async (req: Request, res: Response) => {
  try {
    const { estacionamientoId } = req.params;
    
    const cajones = await Cajon.findAll({
      where: { estacionamientoId },
      order: [['numero', 'ASC']],
      include: [
        { association: 'cliente' },
        { association: 'auto' }
      ]
    });
    
    return res.status(200).json({
      success: true,
      message: 'Cajones del estacionamiento obtenidos correctamente',
      data: cajones
    });
  } catch (error) {
    console.error('Error al obtener cajones del estacionamiento:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener los cajones del estacionamiento',
      error: (error as Error).message
    });
  }
};
