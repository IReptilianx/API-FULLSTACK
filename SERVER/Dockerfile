# Etapa 1: build y entorno de desarrollo
FROM node:18

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos del proyecto
COPY package*.json tsconfig*.json ./
COPY src ./src
COPY .env /app/.env

# Instala dependencias
RUN npm install

# Build para producción
RUN npm run build

# Expone el puerto donde corre tu API (asegúrate que coincide con tu app, p.ej., 3001)
EXPOSE 8080

# Comando para producción
CMD ["npm", "start"]
