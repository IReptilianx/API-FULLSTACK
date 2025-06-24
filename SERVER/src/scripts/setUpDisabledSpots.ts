import sequelize from "../config/db";
import ParkingSpot from "../models/ParkingSpot.model";

/**
 * Este script marca los primeros 6 lugares de estacionamiento como reservados para
 * personas con discapacidad. Se debe ejecutar después de haber hecho las migraciones
 * para añadir la columna isDisabledOnly al modelo ParkingSpot.
 */
async function setUpDisabledSpots() {
  try {
    // Asegurarnos de que la conexión a la base de datos está activa
    await sequelize.authenticate();
    console.log('Conexión a la base de datos establecida correctamente.');

    // Buscar todos los spots existentes
    const spots = await ParkingSpot.findAll();
    console.log(`Encontrados ${spots.length} lugares de estacionamiento.`);

    // Marcar los primeros 6 lugares como reservados para discapacitados
    for (let i = 0; i < spots.length; i++) {
      const spot = spots[i];
      // Los primeros 6 lugares (ID 1-6) serán para discapacitados
      if (spot.id <= 6) {
        spot.isDisabledOnly = true;
        await spot.save();
        console.log(`Lugar #${spot.id} marcado como reservado para personas con discapacidad.`);
      }
    }

    console.log('Proceso completado exitosamente.');
    process.exit(0);
  } catch (error) {
    console.error('Error al configurar los lugares para discapacitados:', error);
    process.exit(1);
  }
}

// Ejecutar la función
setUpDisabledSpots();
