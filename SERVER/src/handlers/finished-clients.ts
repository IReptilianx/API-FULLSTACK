import { Request, Response } from "express";
import Client from "../models/Client.model";

// Obtener clientes con servicio finalizado
export const getFinishedClients = async (req: Request, res: Response) => {
  try {
    const finishedClients = await Client.findAll({
      where: { status: 'finalizado' },
      order: [['endTime', 'DESC']] // Ordenar por fecha de finalización, lo más reciente primero
    });
    
    res.json({ 
      success: true,
      message: "Clientes finalizados obtenidos correctamente",
      data: finishedClients 
    });
  } catch (error: any) {
    console.error("Error al obtener clientes finalizados:", error);
    res.status(500).json({ 
      success: false,
      message: "Error al obtener clientes finalizados", 
      error: error.message || "Error desconocido" 
    });
  }
};
