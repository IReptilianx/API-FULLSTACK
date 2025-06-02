import server from "./server";

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log('Debugger attached.');
  console.log(`REST API en el puerto: ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});