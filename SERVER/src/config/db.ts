import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

if (!process.env.DB_URL) {
  console.error("[DB] La variable de entorno DB_URL no está definida. Verifica tu configuración.");
  throw new Error("La variable de entorno DB_URL no está definida. Verifica tu configuración.");
}

console.log("[DB] Intentando conectar a:", process.env.DB_URL);

const db = new Sequelize(process.env.DB_URL!, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // Solo para desarrollo, en producción usa certificados válidos
    },
  },
  pool: {
    max: 3, // Render recomienda un pool pequeño
    min: 0,
    acquire: 9090,
    idle: 10000,
  },
  logging: (msg) => console.log("[Sequelize]", msg),
});

export default db;