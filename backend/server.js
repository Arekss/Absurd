const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const handlers = require('./handlers');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(path.join(__dirname, '../frontend')));

app.get(['/', '/room/:roomCode'], (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

io.on('connection', function (socket) {
    handlers.onConnection(io, socket); // Delegate to handlers
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, function () {
    console.log(`Server running on port ${PORT}`);
});
