# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory for the server
WORKDIR /app

# Copy server files
COPY SERVER/package.json SERVER/package-lock.json ./
RUN npm install
COPY SERVER/ .

# Expose the port for the server
EXPOSE 8080

# Command to run the server
CMD ["node", "dist/index.js"]
