# Modo Demostrativo de Cobro por Tiempo Real

En este documento se explica cómo funciona el modo demostrativo implementado para visualizar más rápidamente el cobro por tiempo real en el sistema de estacionamiento.

## ¿Qué es el Modo Demostrativo?

Para fines de prueba y demostración, hemos acelerado el paso del tiempo en el sistema. Esta característica permite ver cómo funciona el cobro por tiempo real sin tener que esperar horas reales.

## Características del Modo Demostrativo

- **Multiplicador de tiempo**: En el modo demostrativo, cada minuto real cuenta como una hora en el sistema.
- **Visualización clara**: Se indica claramente cuando se está utilizando el modo demostrativo con banners específicos.
- **Transparencia**: El sistema muestra tanto el tiempo simulado (horas facturadas) como el tiempo real transcurrido (minutos).

## Cómo Funciona

1. Cuando un cliente registra su vehículo, se captura la hora de inicio.
2. Al finalizar el servicio:
   - El sistema calcula los minutos transcurridos desde el registro.
   - Cada minuto se multiplica por 60 para simular horas (1 minuto real = 1 hora simulada).
   - El sistema calcula el precio basado en estas "horas simuladas".

## Ejemplo Práctico

- Un cliente estaciona su vehículo durante 5 minutos reales.
- El sistema calculará: 5 minutos × 60 = 300 minutos = 5 horas simuladas.
- El precio será: 5 horas × $35 = $175 MXN.

## Identificación Visual

El modo demostrativo se identifica visualmente con:

- Un banner rojo intermitente en el modal de finalización del servicio.
- Una etiqueta explicativa en el formulario de registro.
- Información clara sobre el tiempo real vs. tiempo simulado.

## Consideraciones

Este modo es exclusivamente para demostraciones y pruebas. En un entorno de producción real, se desactivaría el multiplicador de tiempo para que el sistema realice los cálculos basados en el tiempo real transcurrido.
