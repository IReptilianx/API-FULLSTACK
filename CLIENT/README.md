# AparClic! - Sistema de Estacionamiento Inteligente

**AparClic!** es un sistema completo de gestión de estacionamientos desarrollado con tecnologías modernas para proporcionar una experiencia de usuario excepcional y control administrativo avanzado.

## 🚀 Características Principales

- **Gestión de Clientes**: Sistema avanzado de perfiles y seguimiento de clientes
- **Tickets Digitales**: Generación automática de tickets con códigos únicos
- **Monitoreo en Tiempo Real**: Dashboard inteligente con estadísticas y análisis
- **Interfaz Moderna**: Diseño responsivo con efectos glassmorphism
- **Control de Ocupación**: Visualización en tiempo real de lugares disponibles
- **Exportación PDF**: Generación de tickets y reportes en formato PDF

## 🛠️ Stack Tecnológico

- **Frontend**: React + TypeScript + Vite
- **Styling**: CSS moderno con efectos glassmorphism
- **Estado**: Redux para gestión del estado
- **PDF**: jsPDF para generación de documentos
- **Backend**: Node.js + Express + TypeScript
- **Base de Datos**: PostgreSQL con Sequelize ORM

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Construir para producción
npm run build
```

## 🎨 Características de Diseño

- Interfaz moderna con efectos glassmorphism
- Animaciones fluidas y transiciones suaves
- Diseño completamente responsivo
- Sistema de colores profesional
- Tipografía Inter para mejor legibilidad

## 📱 Funcionalidades

1. **Registro de Vehículos**: Captura completa de información del cliente y vehículo
2. **Selección de Lugares**: Grid interactivo para selección de espacios
3. **Cálculo Automático**: Precios dinámicos basados en duración
4. **Historial de Actividades**: Seguimiento completo de transacciones
5. **Generación de Tickets**: PDFs personalizados para cada transacción

---

Desarrollado con ❤️ por el equipo de **AparClic!**

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
