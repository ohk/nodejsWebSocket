const io = require("socket.io-client");
const socket = io("http://localhost:8080");

socket.on("connect", () => {
  console.log(socket.id); // 'G5p5...'
});

socket.on("message", (msg) => {
  if (msg === "checkValue") {
    socket.emit("message", {
      name: socket.id,
      category: new Date().toLocaleString(),
      value: Math.floor(Math.random() * (500 - 0 + 1)),
    });
  }
});
