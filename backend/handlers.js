const RoomManager = require('./RoomManager');
const Game = require('./Game');
const Player = require('./Player'); // Import Player directly for instantiation

const roomManager = new RoomManager();
const game = new Game(roomManager);


// Log all rooms and clients using Socket.IO's native rooms
function logRoomsAndClients(io) {
    const rooms = io.sockets.adapter.rooms;
    rooms.forEach((sockets, roomName) => {
        if (!io.sockets.adapter.sids.get(roomName)) { // Only log if it's a server-created room
            console.log(`Room: ${roomName}, Clients: ${sockets.size}`);
        }
    });
}

// Main connection handler
function onConnection(io, socket) {
    // createRoomManagerEventHandlers(io,socket)
    // createRoomEventHandlers(io,socket)
    // createPlayerEventHandlers(io,socket)
    socket.on('createRoom', (nickname) => roomManager.onCreateRoomEvent(io, socket, nickname));
    socket.on('joinRoom', (roomCode, nickname) => roomManager.onJoinRoom(io, socket, roomCode, nickname));
    //socket.on('startGame', (roomCode) => onStartGame(io, socket, roomCode));
    socket.on('getNumOfPlayers', (roomCode) => roomManager.onGetNumOfPlayers(io, socket, roomCode));
}

module.exports = {
    onConnection
};
