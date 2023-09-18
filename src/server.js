const Hapi = require("@hapi/hapi")
const routes = require("./routes")

const init = async () => {
  const PORT = 5000
  const server = Hapi.server({
    port: PORT,
    host: "localhost",
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });
  server.route(routes);
  await server.start();
  console.log(`server sudah berjalan di http://localhost:${PORT}`)
};

init();
