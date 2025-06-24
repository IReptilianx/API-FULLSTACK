import express from 'express';
import router from './router';
import db from './config/db';
import cors from 'cors';
// Importar modelos para sincronización
import { 
  Client, 
  ParkingSpot, 
  Usuario, 
  Product,
  Auto,
  Pago,
  Estacionamiento,
  Cajon
} from './models';

async function connectDB() {
  try {
    await db.authenticate();
    // Usar alter:true para crear la tabla con la estructura definida en el modelo
    await db.sync({ alter: true });
    console.log('Conexión exitosa a la base de datos');
    console.log('Tablas sincronizadas correctamente');
    console.log('Configuración de mapeo: Se usa "id" en el modelo, que se mapea a "id_usuario" en la base de datos');
  } catch (error) {
    console.log('Error al conectarse con la BD:');
    console.log(error);
  }
}

connectDB();
const server = express();

// CORS configuration for production
const corsOptions = {
  origin: [
    'https://api-fullstack-1-maiu.onrender.com',
    'http://localhost:5173',
    'http://localhost:3000',
    /\.onrender\.com$/,
    '*' // Fallback for development
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  credentials: true,
  optionsSuccessStatus: 200 // Some legacy browsers choke on 204
};

server.use(cors(corsOptions));
server.use(express.json());

// Additional CORS headers middleware for extra compatibility
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Handle preflight requests
server.options('*', cors(corsOptions));

server.use('/api', router);

export default server;