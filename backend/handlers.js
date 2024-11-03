const RoomManager = require('./RoomManager');
const Game = require('./Game');
const Player = require('./Player'); // Import Player directly for instantiation

const roomManager = new RoomManager();
const game = new Game(roomManager);

// Map to store metadata for each room
// const roomData = new Map(); // { roomCode => { owner, players: [], scores: {} } }

// Log all rooms and clients using Socket.IO's native rooms
function logRoomsAndClients(io) {
    const rooms = io.sockets.adapter.rooms;
    rooms.forEach((sockets, roomName) => {
        if (!io.sockets.adapter.sids.get(roomName)) { // Only log if it's a server-created room
            console.log(`Room: ${roomName}, Clients: ${sockets.size}`);
        }
    });
}




// Event handler for 'startGame'
/* function onStartGame(io, socket, roomCode) {
    const roomInfo = roomData.get(roomCode);

    if (roomInfo && roomInfo.players) {
        game.startGame(roomCode);
        io.to(roomCode).emit('gameStarted', roomInfo.players);
    } else {
        socket.emit('error', 'Room does not exist.');
    }
} */

// Main connection handler
function onConnection(io, socket) {
    // createRoomManagerEventHandlers(io,socket)
    // createRoomEventHandlers(io,socket)
    // createPlayerEventHandlers(io,socket)
    socket.on('createRoom', (nickname) => roomManager.onCreateRoomEvent(io, socket, nickname));
    socket.on('joinRoom', (roomCode) => roomManager.onJoinRoom(io, socket, roomCode));
    //socket.on('startGame', (roomCode) => onStartGame(io, socket, roomCode));
    socket.on('getNumOfPlayers', (roomCode) => roomManager.onGetNumOfPlayers(io, socket, roomCode));
}

module.exports = {
    onConnection
};
