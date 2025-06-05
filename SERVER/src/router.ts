import { Router } from 'express';
import { createProduct, getProducts, getProductById, updateProductById, deleteProduct } from './handlers/product';
import { createClient, getClients, getClientById, updateClient, deleteClient, saveClient } from './handlers/client';
import { registerUser, loginUser, getUsers, getAllUsersWithPasswords } from './handlers/auth';
import { body, param } from 'express-validator'; // Importa 'param' para validar parámetros
import { handleInputErrors } from './middleware';

const router = Router();

// Ruta para obtener la lista de productos
router.get('/products', getProducts);

// Ruta para obtener un producto por ID con validación
router.get(
  '/products/:id',
  param('id').isInt().withMessage("El id debe ser un número entero"), // Validación del parámetro 'id'
  handleInputErrors, // Middleware para manejar errores de validación
  getProductById
);

// Validación y creación de productos
router.post(
  '/products',
  body('name').notEmpty().withMessage("Name is required"),
  body('price')
    .isNumeric().withMessage("Valor no válido")
    .notEmpty().withMessage("El precio del producto no puede ir vacio")
    .custom(value => value > 0).withMessage("El precio no valido"),
  handleInputErrors,
  createProduct,
);

// Actualización de productos por ID con validación
router.put(
  '/products/:id',
  param('id').isInt().withMessage("El id debe ser un número entero"), // Validación del parámetro 'id'
  body('name').optional().notEmpty().withMessage("Name no puede estar vacío"),
  body('price')
    .optional()
    .isNumeric().withMessage("El precio debe ser un número")
    .custom(value => value > 0).withMessage("El precio debe ser mayor a 0"),
  handleInputErrors, // Middleware para manejar errores de validación
  updateProductById
);

// Ruta para eliminar un producto por ID con validación
router.delete(
  '/products/:id',
  param('id').isInt().withMessage("El id debe ser un número entero"), // Validación del parámetro 'id'
  handleInputErrors, // Middleware para manejar errores de validación
  deleteProduct
);

// Validación y creación de clientes
router.post(
  '/clients',
  body('nombre').notEmpty().withMessage("El nombre es obligatorio"),
  body('apellido').notEmpty().withMessage("El apellido es obligatorio"),
  body('telefono').notEmpty().withMessage("El teléfono es obligatorio"),
  handleInputErrors,
  createClient
);

// Rutas para operaciones CRUD de clientes
router.get('/clients', getClients); // Obtener todos los clientes
router.get('/clients/:id', getClientById); // Obtener cliente por ID
router.put('/clients/:id', updateClient); // Actualizar cliente por ID
router.delete('/clients/:id', deleteClient); // Eliminar cliente por ID
router.post(
  '/clients/save',
  body('nombre').notEmpty().withMessage("El nombre es obligatorio"),
  body('apellido').notEmpty().withMessage("El apellido es obligatorio"),
  body('telefono').notEmpty().withMessage("El teléfono es obligatorio"),
  body('placas').notEmpty().withMessage("Las placas son obligatorias"),
  body('auto').notEmpty().withMessage("El auto es obligatorio"),
  body('color').notEmpty().withMessage("El color es obligatorio"),
  handleInputErrors,  saveClient
);

// Rutas de autenticación
router.post(
  '/user/register',
  body('nombreCompleto').notEmpty().withMessage("El nombre completo es obligatorio"),
  body('apellido').notEmpty().withMessage("El apellido es obligatorio"),
  body('email').isEmail().withMessage("El email debe ser válido"),
  body('password').isLength({min: 6}).withMessage("La contraseña debe tener al menos 6 caracteres"),
  body('telefono').notEmpty().withMessage("El teléfono es obligatorio"),
  handleInputErrors,
  registerUser
);

router.post(
  '/user/login',
  body('email').isEmail().withMessage("El email debe ser válido"),
  body('password').notEmpty().withMessage("La contraseña es obligatoria"),
  handleInputErrors,
  loginUser
);

router.get('/user/users', getUsers); // Para obtener lista de usuarios (admin)
router.get('/user/all-users', getAllUsersWithPasswords); // Para consultar todos los usuarios con contraseñas

export default router;

