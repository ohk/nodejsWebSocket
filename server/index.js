const http = require("http");
const socket = require("socket.io");

const server = http.createServer();
const io = socket(server);

io.on("connection", (socket) => {
  console.info(`Client connected [id=${socket.id}]`);
  socket.emit("message", `Client connected [id=${socket.id}]`);
  io.emit("admin", {
    id: socket.id,
  });
  socket.on("message", (msg) => {
    console.log(msg);
    io.emit("admin", msg);
  });
});

server.listen(8080, () => console.log(`Server Running`));
