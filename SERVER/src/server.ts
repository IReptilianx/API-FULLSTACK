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
server.use(express.json());
server.use(cors({
  origin: process.env.NODE_ENV === 'production' ? 'https://api-fullstack-1-rlv5.onrender.com' : '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
server.use('/api', router);

export default server;