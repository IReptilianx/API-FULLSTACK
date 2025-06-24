# Implementación de Lugares Reservados para Discapacitados

Este documento detalla los cambios realizados para implementar 6 lugares de estacionamiento reservados exclusivamente para personas con discapacidad.

## Cambios Realizados

### 1. Modelos de Base de Datos

Se han actualizado los siguientes modelos:

- **Client**: Se agregó un campo `isDisabled` (tipo Boolean) para indicar si un cliente tiene discapacidad.
- **ParkingSpot**: Se agregó un campo `isDisabledOnly` (tipo Boolean) para marcar los lugares reservados para personas con discapacidad.

### 2. Interfaz de Usuario

- Se agregó un checkbox en el formulario para que los usuarios puedan indicar si tienen discapacidad.
- Los lugares reservados para personas con discapacidad se muestran con un estilo diferente y con el símbolo ♿.
- Se implementó una validación para que solo las personas que marquen la opción de discapacidad puedan seleccionar estos lugares.

### 3. Lógica de Asignación

- Los primeros 6 lugares de estacionamiento (IDs 1-6) están reservados para personas con discapacidad.
- Si un cliente no tiene discapacidad e intenta seleccionar uno de estos lugares, se muestra un mensaje de error.
- Los clientes con discapacidad pueden seleccionar cualquier lugar disponible (incluyendo los no reservados).

## Pasos para Implementar los Cambios

1. **Actualizar la Base de Datos**:

   Para aplicar las migraciones y marcar los primeros 6 lugares como reservados para discapacitados, ejecute el siguiente comando:

   ```bash
   cd SERVER
   npx ts-node src/scripts/setUpDisabledSpots.ts
   ```

2. **Reiniciar el Servidor**:

   Después de aplicar los cambios, reinicie el servidor:

   ```bash
   npm run dev
   ```

3. **Verificar la Implementación**:

   - Inicie sesión en la aplicación.
   - Intente registrar un cliente sin marcar la opción de discapacidad y verifique que no pueda seleccionar los primeros 6 lugares.
   - Registre un cliente marcando la opción de discapacidad y verifique que pueda seleccionar cualquiera de los lugares disponibles.

## Notas Adicionales

- Los lugares para discapacitados se muestran con un borde azul y un fondo azul claro para distinguirlos.
- El símbolo ♿ se muestra en la esquina superior derecha de los lugares reservados para discapacitados.
- La validación se realiza tanto en el frontend como en el backend para garantizar que solo los clientes con discapacidad puedan ocupar estos lugares.
