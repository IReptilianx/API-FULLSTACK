import server from "./server";

const PORT = Number(process.env.PORT) || 9090; // Convert process.env.PORT to a number
server.listen(PORT, '0.0.0.0', () => {
  console.log('Debugger attached.');
  console.log(`REST API en el puerto: ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});