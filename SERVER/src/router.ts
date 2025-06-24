import { Router } from 'express';
import { createProduct, getProducts, getProductById, updateProductById, deleteProduct } from './handlers/product';
import { createClient, getClients, getClientById, updateClient, deleteClient, saveClient, getActiveClients, finishService } from './handlers/client';
import { registerUser, loginUser, getUsers, getAllUsersWithPasswords, deleteUser } from './handlers/user';
import { getAllParkingSpots, updateParkingSpot } from './handlers/parkingSpot';
import { body, param, query } from 'express-validator'; // Importa 'param' y 'query' para validar parámetros
import { handleInputErrors, isAuthenticated, isAdmin } from './middleware';

// Importar los nuevos handlers
import { 
  getAllAutos, 
  getAutoById, 
  createAuto, 
  updateAuto, 
  deleteAuto, 
  getAutosByClientId 
} from './handlers/auto';

import {
  getAllPagos,
  getPagoById,
  createPago,
  updatePago,
  deletePago,
  getPagosByClientId,
  getPagosByDate
} from './handlers/pago';

import {
  getAllEstacionamientos,
  getEstacionamientoById,
  createEstacionamiento,
  updateEstacionamiento,
  deleteEstacionamiento,
  getEstacionamientoStats
} from './handlers/estacionamiento';

import {
  getAllCajones,
  getCajonById,
  createCajon,
  updateCajon,
  deleteCajon,
  assignCajonToClient,
  releaseCajon,
  getCajonesByEstacionamiento
} from './handlers/cajon';

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
router.get('/clients/active', getActiveClients); // Obtener clientes con servicio activo
// Nota: Las rutas más específicas deben estar antes de las rutas parametrizadas
router.get('/clients/:id([0-9]+)', getClientById); // Obtener cliente por ID (solo números)
router.put('/clients/:id([0-9]+)', updateClient); // Actualizar cliente por ID (solo números)
router.delete('/clients/:id([0-9]+)', deleteClient); // Eliminar cliente por ID (solo números)
router.post(
  '/clients/save',
  body('nombre').notEmpty().withMessage("El nombre es obligatorio"),
  body('apellido').notEmpty().withMessage("El apellido es obligatorio"),
  body('telefono').notEmpty().withMessage("El teléfono es obligatorio"),
  body('placas').notEmpty().withMessage("Las placas son obligatorias"),
  body('auto').notEmpty().withMessage("El auto es obligatorio"),
  body('color').notEmpty().withMessage("El color es obligatorio"),
  body('spot').notEmpty().withMessage("El lugar de estacionamiento es obligatorio"),
  handleInputErrors, 
  saveClient
);

// Ruta para finalizar el servicio de un cliente (accesible para todos los usuarios autenticados)
router.put(
  '/clients/:id([0-9]+)/finish',
  param('id').isInt().withMessage("El ID debe ser un número entero"),
  handleInputErrors,
  finishService
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

// Rutas protegidas para administradores
router.get('/users', isAuthenticated, isAdmin, getUsers); // Para obtener lista de usuarios (admin)
router.get('/user/users', isAuthenticated, isAdmin, getUsers); // Para obtener lista de usuarios (admin) - mantener compatibilidad
router.get('/user/all-users', isAuthenticated, isAdmin, getAllUsersWithPasswords); // Para consultar todos los usuarios con contraseñas
router.delete('/users/:id', isAuthenticated, isAdmin, deleteUser); // Eliminar usuario (solo admin)

// Rutas para parking spots
router.get('/parking-spots', getAllParkingSpots);
router.put('/parking-spots/:id', updateParkingSpot);

// Rutas para autos
router.get('/autos', getAllAutos);
router.get('/autos/:id', param('id').isInt().withMessage("El id debe ser un número entero"), handleInputErrors, getAutoById);
router.get('/clientes/:clienteId/autos', param('clienteId').isInt().withMessage("El id del cliente debe ser un número entero"), handleInputErrors, getAutosByClientId);
router.post('/autos', 
  body('marca').notEmpty().withMessage("La marca es obligatoria"),
  body('modelo').notEmpty().withMessage("El modelo es obligatorio"),
  body('ano').isInt().withMessage("El año debe ser un número entero"),
  body('placas').notEmpty().withMessage("Las placas son obligatorias"),
  body('color').notEmpty().withMessage("El color es obligatorio"),
  body('tipo').notEmpty().withMessage("El tipo es obligatorio"),
  body('clienteId').isInt().withMessage("El id del cliente debe ser un número entero"),
  handleInputErrors,
  createAuto
);
router.put('/autos/:id',
  param('id').isInt().withMessage("El id debe ser un número entero"),
  handleInputErrors,
  updateAuto
);
router.delete('/autos/:id', param('id').isInt().withMessage("El id debe ser un número entero"), handleInputErrors, deleteAuto);

// Rutas para pagos
router.get('/pagos', getAllPagos);
router.get('/pagos/:id', param('id').isInt().withMessage("El id debe ser un número entero"), handleInputErrors, getPagoById);
router.get('/clientes/:clienteId/pagos', param('clienteId').isInt().withMessage("El id del cliente debe ser un número entero"), handleInputErrors, getPagosByClientId);
router.get('/pagos/fecha', 
  query('fechaInicio').isDate().withMessage("La fecha de inicio debe ser válida"),
  query('fechaFin').isDate().withMessage("La fecha final debe ser válida"),
  handleInputErrors,
  getPagosByDate
);
router.post('/pagos', 
  body('clienteId').isInt().withMessage("El id del cliente debe ser un número entero"),
  body('monto').isFloat({min: 0}).withMessage("El monto debe ser un número mayor a 0"),
  body('metodoPago').isIn(['efectivo', 'tarjeta', 'transferencia', 'otro']).withMessage("El método de pago no es válido"),
  handleInputErrors,
  createPago
);
router.put('/pagos/:id',
  param('id').isInt().withMessage("El id debe ser un número entero"),
  handleInputErrors,
  updatePago
);
router.delete('/pagos/:id', param('id').isInt().withMessage("El id debe ser un número entero"), handleInputErrors, deletePago);

// Rutas para estacionamientos
router.get('/estacionamientos', getAllEstacionamientos);
router.get('/estacionamientos/:id', param('id').isInt().withMessage("El id debe ser un número entero"), handleInputErrors, getEstacionamientoById);
router.get('/estacionamientos/:id/stats', param('id').isInt().withMessage("El id debe ser un número entero"), handleInputErrors, getEstacionamientoStats);
router.post('/estacionamientos', 
  body('nombre').notEmpty().withMessage("El nombre es obligatorio"),
  body('direccion').notEmpty().withMessage("La dirección es obligatoria"),
  handleInputErrors,
  createEstacionamiento
);
router.put('/estacionamientos/:id',
  param('id').isInt().withMessage("El id debe ser un número entero"),
  handleInputErrors,
  updateEstacionamiento
);
router.delete('/estacionamientos/:id', param('id').isInt().withMessage("El id debe ser un número entero"), handleInputErrors, deleteEstacionamiento);

// Rutas para cajones
router.get('/cajones', getAllCajones);
router.get('/cajones/:id', param('id').isInt().withMessage("El id debe ser un número entero"), handleInputErrors, getCajonById);
router.get('/estacionamientos/:estacionamientoId/cajones', param('estacionamientoId').isInt().withMessage("El id del estacionamiento debe ser un número entero"), handleInputErrors, getCajonesByEstacionamiento);
router.post('/cajones', 
  body('numero').isInt({min: 1}).withMessage("El número debe ser un entero positivo"),
  body('estacionamientoId').isInt().withMessage("El id del estacionamiento debe ser un número entero"),
  body('parkingSpotId').isInt().withMessage("El id del parking spot debe ser un número entero"),
  handleInputErrors,
  createCajon
);
router.put('/cajones/:id',
  param('id').isInt().withMessage("El id debe ser un número entero"),
  handleInputErrors,
  updateCajon
);
router.delete('/cajones/:id', param('id').isInt().withMessage("El id debe ser un número entero"), handleInputErrors, deleteCajon);
router.post('/cajones/:cajonId/asignar',
  param('cajonId').isInt().withMessage("El id del cajón debe ser un número entero"),
  body('clienteId').isInt().withMessage("El id del cliente debe ser un número entero"),
  body('autoId').isInt().withMessage("El id del auto debe ser un número entero"),
  handleInputErrors,
  assignCajonToClient
);
router.post('/cajones/:cajonId/liberar', param('cajonId').isInt().withMessage("El id del cajón debe ser un número entero"), handleInputErrors, releaseCajon);

// Importar el handler para clientes finalizados
import { getFinishedClients } from './handlers/finished-clients';

// Ruta para clientes finalizados
router.get('/clients/finished', getFinishedClients);

export default router;
