# AparClic! - Sistema de Estacionamiento Inteligente

![AparClic! Logo](https://img.shields.io/badge/AparClic!-Sistema%20de%20Estacionamiento-blue?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTMgNkg5VjlIM1Y2WiIgZmlsbD0iIzY2N0VFQSIvPgo8cGF0aCBkPSJNMTIgNkgxOFY5SDEyVjZaIiBmaWxsPSIjNzY0QkEyIi8+CjxwYXRoIGQ9Ik0zIDEySDE4VjE1SDNWMTJaIiBmaWxsPSIjRjA5M0ZCIi8+Cjwvc3ZnPgo=)

**AparClic!** es un sistema completo de gestión de estacionamientos desarrollado con las últimas tecnologías web para proporcionar una experiencia de usuario excepcional y un control administrativo avanzado.

## 🌟 Características Principales

- ✅ **Gestión Inteligente de Clientes**
- ✅ **Tickets Digitales con PDF**
- ✅ **Monitoreo en Tiempo Real**
- ✅ **Interfaz Moderna Glassmorphism**
- ✅ **Sistema Responsivo**
- ✅ **Dashboard Administrativo**

## 🚀 Tecnologías Utilizadas

### Frontend
- **React 18** con TypeScript
- **Vite** para desarrollo rápido
- **CSS moderno** con efectos glassmorphism
- **Redux** para gestión de estado
- **React Router** para navegación
- **jsPDF** para generación de documentos

### Backend
- **Node.js** con Express
- **TypeScript** para tipado fuerte
- **PostgreSQL** como base de datos
- **Sequelize ORM** para abstracción de datos
- **CORS** habilitado para comunicación frontend

## 📦 Estructura del Proyecto

```
AparClic!/
├── CLIENT/                    # Aplicación React
│   ├── src/
│   │   ├── Complements/      # Componentes principales
│   │   ├── data/            # Datos y constantes
│   │   ├── assets/          # Recursos estáticos
│   │   └── types/           # Definiciones TypeScript
│   ├── index.html           # HTML principal
│   └── package.json         # Dependencias del cliente
├── SERVER/                   # API REST
│   ├── src/
│   │   ├── handlers/        # Controladores de rutas
│   │   ├── models/          # Modelos de datos
│   │   ├── config/          # Configuración de DB
│   │   └── middleware/      # Middlewares
│   └── package.json         # Dependencias del servidor
└── docker-compose.yml       # Configuración Docker
```

## 🛠️ Instalación y Configuración

### Prerrequisitos
- Node.js 18+
- PostgreSQL 14+
- npm o yarn

### Instalación

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd aparclic-system
```

2. **Instalar dependencias del cliente**
```bash
cd CLIENT
npm install
```

3. **Instalar dependencias del servidor**
```bash
cd ../SERVER
npm install
```

4. **Configurar base de datos**
```bash
# Crear base de datos PostgreSQL
createdb aparclic_db
```

5. **Ejecutar el sistema**

**Terminal 1 (Servidor):**
```bash
cd SERVER
npm run dev
```

**Terminal 2 (Cliente):**
```bash
cd CLIENT
npm run dev
```

## 🎨 Características de Diseño

- **Glassmorphism UI**: Efectos de vidrio modernos
- **Gradientes Dinámicos**: Colores que cambian suavemente
- **Animaciones Fluidas**: Transiciones CSS optimizadas
- **Tipografía Inter**: Fuente moderna y legible
- **Responsive Design**: Compatible con todos los dispositivos

## 📱 Funcionalidades

### 🏠 Página Principal
- Hero section con branding AparClic!
- Navegación glassmorphism
- Modales informativos (Contacto, Ubicación, Precios, Acerca de)
- Animaciones y efectos visuales

### 👤 Sistema de Autenticación
- Login de usuarios registrados
- Registro de nuevos usuarios
- Validación de formularios
- Interfaz moderna con efectos visuales

### 📝 Gestión de Registros
- Formulario completo de información del cliente
- Selección interactiva de lugares de estacionamiento
- Cálculo automático de precios
- Exportación de PDF personalizada

### 📊 Dashboard Administrativo
- Vista en tiempo real de ocupación
- Historial de actividades
- Generación de tickets
- Métricas de ingresos

## 💰 Tarifas

| Servicio | Precio | Descripción |
|----------|--------|-------------|
| **Por Hora** | $35 MXN | Ideal para estancias cortas |
| **Tarifa Diaria** | $280 MXN | Hasta 24 horas completas |
| **Mensualidad** | $900 MXN | La mejor opción para usuarios frecuentes |

## 📞 Contacto

- **Encargado**: Oscar Garduño Reyes
- **Email**: garduñoreyes@gmail.com
- **Teléfono**: 712 141 6913
- **Dirección**: Manzana 007, Francisco I Madero, El Oro de Hidalgo, 50603

## 🔧 Desarrollo

### Scripts Disponibles

**Cliente:**
```bash
npm run dev      # Servidor de desarrollo
npm run build    # Construcción para producción
npm run preview  # Vista previa de la construcción
```

**Servidor:**
```bash
npm run dev      # Servidor con nodemon
npm run build    # Compilar TypeScript
npm run start    # Ejecutar versión compilada
```

### API Endpoints

```
POST /api/user/register     # Registro de usuarios
POST /api/user/login        # Inicio de sesión
GET  /api/user/users        # Lista de usuarios
POST /api/client/save       # Guardar cliente
GET  /api/client            # Obtener clientes
```

## 🐳 Docker

```bash
# Ejecutar con Docker Compose
docker-compose up -d

# Acceder a:
# Frontend: http://localhost:3000
# Backend: http://localhost:8080
```

## 📝 Licencia

© 2024 AparClic! - Sistema de Estacionamiento Inteligente
Desarrollado por Ramon - Todos los derechos reservados

---

## 🤝 Contribución

1. Fork del proyecto
2. Crear rama feature (`git checkout -b feature/NuevaCaracteristica`)
3. Commit cambios (`git commit -m 'Agregar nueva característica'`)
4. Push a la rama (`git push origin feature/NuevaCaracteristica`)
5. Crear Pull Request

---

**¡Gracias por elegir AparClic! para la gestión de tu estacionamiento!** 🚗💙
