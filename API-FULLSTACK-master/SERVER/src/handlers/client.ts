import { Request, Response } from "express";
import Client from "../models/Client.model";

export const createClient = async (req: Request, res: Response) => {
  try {
    console.log('CreateClient - Request body:', req.body);
    
    // Verificar si se proporciona un valor para spotId
    if (!req.body.spotId && req.body.spot) {
      req.body.spotId = req.body.spot;
    }
    
    // Validar que spotId esté presente
    if (!req.body.spotId) {
      return res.status(400).json({
        message: "El campo spotId es requerido"
      });
    }
    
    // Asegurar que se incluyan todos los campos requeridos
    if (!req.body.startTime) {
      req.body.startTime = new Date();
    }
    
    // Establecer valores por defecto para otros campos si no existen
    if (req.body.status === undefined) {
      req.body.status = 'activo';
    }
    
    if (req.body.isDisabled === undefined) {
      req.body.isDisabled = false;
    }
    
    const client = new Client(req.body);
    await client.save(); // Esperar a que se complete la operación
    res.json({ data: client });
  } catch (error) {
    console.error("Error al crear cliente:", error);
    res.status(500).json({ 
      message: "Error al crear el cliente", 
      error: error.message,
      details: error.parent ? error.parent.detail : null
    });
  }
};

export const getClients = async (req: Request, res: Response) => {
  const clients = await Client.findAll();
  res.json({ data: clients });
};

export const getClientById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const client = await Client.findByPk(id);
  if (!client) {
    return res.status(404).json({ error: "Client not found" });
  }
  res.json({ data: client });
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
    const { nombre, apellido, telefono, placas, auto, color, spot, hours, price } = req.body;
    
    // Validar datos requeridos
    if (!nombre || !placas || !auto || !color || !spot) {
      return res.status(400).json({ 
        message: "Datos incompletos. Los campos nombre, placas, auto, color y spot son obligatorios."
      });
    }
    
    // Crear un objeto con los datos del cliente
    const clientData = {
      nombre,
      apellido,
      telefono,
      placas,
      auto,
      color,
      status: 'activo',
      spotId: spot,
      hours: hours || null,
      price: price || null,
      startTime: new Date(), // Agregar la hora de inicio actual
      endTime: null,
      isDisabled: false
    };
    
    console.log('Datos a guardar:', clientData); // Verificar datos antes de crear
    const newClient = await Client.create(clientData);
    
    console.log('Cliente creado:', newClient); // Verificar cliente creado
    res.status(201).json({ message: "Cliente guardado exitosamente", data: newClient });
  } catch (error) {
    console.error("Error al guardar cliente:", error); // Mostrar el error completo
    res.status(500).json({ 
      message: "Error al guardar el cliente", 
      error: error.message,  // Devolver el mensaje de error
      details: error.parent ? error.parent.detail : null // Devolver detalles si están disponibles
    });
  }
};