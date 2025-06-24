import { Request, Response } from "express";
import Product from "../models/Product.model";

export const createProduct = async (req: Request, res: Response) => {
  const product = await Product.create(req.body);
  res.json({ data: product });
};

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.findAll({
      order: [
        ['id', 'ASC']
      ],
      attributes: { exclude: ['createdAt', 'updatedAt', 'disponibility'] },
      limit: 5,
    });
    res.json({ data: products });
  } catch (error) {
    console.log(error);
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (!product) {
      res.status(404).json({ error: "Producto no encontrado" });
      return;
    }
    res.json({ data: product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const updateProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const [updatedRows] = await Product.update(req.body, {
      where: { id },
    });

    if (updatedRows === 0) {
      res.status(404).json({ error: "Producto no encontrado" });
      return;
    }

    const updatedProduct = await Product.findByPk(id);
    res.json({ data: updatedProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    // Verificar que el producto existe
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (!product) {
      res.status(404).json({ error: "Producto no encontrado" });
      return;
    }

    // Eliminar el producto
    await product.destroy();
    res.json({ message: "Producto eliminado" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};