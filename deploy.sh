#!/bin/bash

# 🚀 AparClic! - Script de Despliegue a Producción

echo "🚀 Iniciando despliegue de AparClic! a producción..."

# Verificar que existe el archivo .env
if [ ! -f .env ]; then
    echo "❌ Error: No se encontró el archivo .env"
    echo "📝 Por favor, crea el archivo .env basado en .env.example"
    exit 1
fi

# Verificar variables de entorno requeridas
echo "🔍 Verificando variables de entorno..."
if [ -z "$DB_URL" ]; then
    echo "❌ Error: DB_URL no está configurada"
    exit 1
fi

# Build de los proyectos
echo "📦 Construyendo proyecto cliente..."
cd CLIENT
npm ci
npm run build
cd ..

echo "📦 Construyendo proyecto servidor..."
cd SERVER
npm ci
npm run build || echo "⚠️ Advertencia: Build del servidor falló, continuando con JavaScript"
cd ..

# Verificar que el build del cliente se completó
if [ ! -d "CLIENT/dist" ]; then
    echo "❌ Error: No se encontró el directorio dist del cliente"
    exit 1
fi

# Construir imágenes Docker
echo "🐳 Construyendo imágenes Docker..."
docker-compose -f docker-compose.prod.yml build

# Detener contenedores anteriores
echo "🛑 Deteniendo contenedores anteriores..."
docker-compose -f docker-compose.prod.yml down

# Iniciar servicios en producción
echo "🚀 Iniciando servicios en producción..."
docker-compose -f docker-compose.prod.yml up -d

# Verificar que los servicios están corriendo
echo "🔍 Verificando estado de los servicios..."
sleep 10

if docker-compose -f docker-compose.prod.yml ps | grep -q "Up"; then
    echo "✅ ¡Despliegue completado exitosamente!"
    echo ""
    echo "📊 Estado de los servicios:"
    docker-compose -f docker-compose.prod.yml ps
    echo ""
    echo "🌐 URLs disponibles:"
    echo "   Frontend: http://localhost"
    echo "   Backend:  http://localhost:8080"
    echo "   Health:   http://localhost:8080/health"
else
    echo "❌ Error: Los servicios no se iniciaron correctamente"
    echo "📋 Logs del servidor:"
    docker-compose -f docker-compose.prod.yml logs server
    exit 1
fi

echo ""
echo "🎉 ¡AparClic! desplegado exitosamente en producción!"
