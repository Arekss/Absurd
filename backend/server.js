const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");
const handlers = require("./handlers");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(path.join(__dirname, "../frontend")));

app.get(["/"], (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

io.on("connection", function (socket) {
  handlers.onConnection(io, socket); // Delegate to handlers
});


app.use((req, res) => {
  res.status(404).send(`
    <h1>404: Page not found</h1>
    <p>The page you are looking for does not exist.</p>
    <a href="/" style="text-decoration: none; color: blue;">
      <button style="padding: 10px 20px; font-size: 16px;">Go to Home Page</button>
    </a>
  `);
});
const PORT = process.env.PORT || 5000;
server.listen(PORT, function () {
  console.log(`Server running on port ${PORT}`);
});
