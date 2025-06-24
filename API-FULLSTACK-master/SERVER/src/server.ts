import express from 'express';
import router from './router';
import db from './config/db';
import cors from 'cors';
// Importar modelos para sincronización
import './models/Client.model';
import './models/Usuario.model';
import './models/Product.model';

async function connectDB() {
  try {
    await db.authenticate();
    await db.sync();
    console.log('Conexión exitosa a la base de datos');
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