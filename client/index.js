const io = require("socket.io-client");
const socket = io("http://localhost:8080");

console.log(socket.id); // undefined

socket.on("connect", () => {
  console.log(socket.id); // 'G5p5...'
});

socket.on("message", (msg) => {
  console.log(msg);
});

setInterval(function () {
  socket.emit("message", {
    name: socket.id,
    category: Date.now(),
    value: Math.floor(Math.random() * (40 - 25 + 1) + 25),
  });
}, 3000);
