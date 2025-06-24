import { Request, Response } from "express";
import Client from "../models/Client.model";

export const createClient = async (req: Request, res: Response) => {
  const client = new Client(req.body);
  client.save();
  res.json({ data: client });
};

export const getClients = async (req: Request, res: Response) => {
  const clients = await Client.findAll();
  res.json({ data: clients });
};

// Obtener todos los clientes con servicio activo
export const getActiveClients = async (req: Request, res: Response) => {
  try {
    const activeClients = await Client.findAll({
      where: { status: 'activo' }
    });
    res.json({ data: activeClients });
  } catch (error: any) {
    res.status(500).json({ 
      message: "Error al obtener clientes activos", 
      error: error.message || "Error desconocido" 
    });
  }
};

export const getClientById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Validación adicional para asegurar que id es un número
    const clientId = Number(id);
    if (isNaN(clientId)) {
      return res.status(400).json({ 
        error: "Invalid client ID", 
        message: "El ID del cliente debe ser un número entero" 
      });
    }
    
    const client = await Client.findByPk(clientId);
    if (!client) {
      return res.status(404).json({ error: "Client not found" });
    }
    res.json({ data: client });
  } catch (error: any) {
    console.error("Error al obtener cliente por ID:", error);
    res.status(500).json({ 
      error: "Error retrieving client", 
      message: error.message || "Error desconocido"
    });
  }
};

export const updateClient = async (req: Request, res: Response) => {
  const { id } = req.params;
  const [updatedRowsCount, updatedRows] = await Client.update(req.body, {
    where: { id },
    returning: true,
  });
  if (updatedRowsCount === 0) {
    return res.status(404).json({ error: "Client not found" });
  }
  res.json({ data: updatedRows[0] });
};

// Finalizar el servicio de un cliente (liberar el cajón)
export const finishService = async (req: Request, res: Response) => {
  const { id } = req.params;
  
  // Validación adicional para asegurar que id es un número
  const clientId = Number(id);
  if (isNaN(clientId)) {
    return res.status(400).json({ 
      error: "Invalid client ID", 
      message: "El ID del cliente debe ser un número entero" 
    });
  }
  
  try {
    const client = await Client.findByPk(clientId);
    if (!client) {
      return res.status(404).json({ error: "Cliente no encontrado" });
    }
    
    // Calcular el tiempo real que estuvo estacionado
    const startTime = new Date(client.startTime);
    const endTime = new Date();
    
    // Diferencia en milisegundos
    const timeDiff = endTime.getTime() - startTime.getTime();
    
    // MODO DEMOSTRATIVO: Cada minuto cuenta como una hora (60 veces más rápido)
    const timeMultiplier = 60; // 1 minuto en la vida real = 1 hora en el sistema
    const simulatedTimeDiff = timeDiff * timeMultiplier;
    
    // Convertir a horas (redondeando hacia arriba)
    // Para modo demo: dividimos por 1000*60 (para obtener minutos) en lugar de 1000*60*60 (para horas)
    const hoursParked = Math.ceil(simulatedTimeDiff / (1000 * 60 * 60));
    
    // Calcular el precio (35 pesos por hora)
    const finalPrice = hoursParked * 35;
    
    // Tiempo real en minutos (para mostrar en el frontend en modo demo)
    const realMinutes = Math.round(timeDiff / (1000 * 60));
    
    // Actualizar el cliente con la información final
    await Client.update({
      status: 'finalizado',
      endTime: endTime,
      hours: hoursParked,
      price: finalPrice
    }, {
      where: { id }
    });
    
    res.json({ 
      message: "Servicio finalizado exitosamente",
      spotId: client.spotId,
      hoursParked,
      finalPrice,
      realMinutes,
      isDemo: true // Indicar que estamos en modo demostrativo
    });
  } catch (error: any) {
    res.status(500).json({ 
      message: "Error al finalizar el servicio", 
      error: error.message || "Error desconocido" 
    });
  }
};

export const deleteClient = async (req: Request, res: Response) => {
  const { id } = req.params;
  const deletedRowsCount = await Client.destroy({ where: { id } });
  if (deletedRowsCount === 0) {
    return res.status(404).json({ error: "Client not found" });
  }
  res.json({ message: "Client deleted successfully" });
};

export const saveClient = async (req: Request, res: Response) => {
  try {
    console.log('Request body:', req.body); // Debugging incoming data
    const { nombre, apellido, telefono, placas, auto, color, spot, isDisabled } = req.body;
    
    // Inicializar con valores predeterminados para hours y price
    // El precio real se calculará al finalizar el servicio
    const newClient = await Client.create({
      nombre,
      apellido,
      telefono,
      placas,
      auto,
      color,
      hours: 1, // Valor inicial, se actualizará al finalizar
      price: 35, // Precio base por hora, se actualizará al finalizar
      spotId: spot,
      status: 'activo',
      isDisabled: isDisabled || false,
      startTime: new Date()
    });
    
    res.status(201).json({ 
      message: "Cliente guardado exitosamente", 
      data: newClient 
    });
  } catch (error: any) {
    console.error('Error al guardar el cliente:', error);
    
    // Si es un error de validación de Sequelize
    if (error.name === 'SequelizeValidationError') {
      const validationErrors = error.errors.map((e: any) => ({
        field: e.path,
        message: e.message
      }));
      
      return res.status(400).json({
        message: "Error de validación",
        errors: validationErrors
      });
    }
    
    res.status(500).json({ 
      message: "Error al guardar el cliente", 
      error: error.message || "Error desconocido" 
    });
  }
};