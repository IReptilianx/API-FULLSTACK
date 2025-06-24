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
    const { nombre, apellido, telefono, placas, auto, color } = req.body;
    const newClient = await Client.create({
      nombre,
      apellido,
      telefono,
      placas,
      auto,
      color,
    });
    res.status(201).json({ message: "Cliente guardado exitosamente", data: newClient });
  } catch (error) {
    res.status(500).json({ message: "Error al guardar el cliente", error });
  }
};