const RoomManager = require('./RoomManager');
const Game = require('./Game');
const Player = require('./Player'); // Import Player directly for instantiation

const roomManager = new RoomManager();
const game = new Game(roomManager);

// Map to store metadata for each room
const roomData = new Map(); // { roomCode => { owner, players: [], scores: {} } }

// Log all rooms and clients using Socket.IO's native rooms
function logRoomsAndClients(io) {
    const rooms = io.sockets.adapter.rooms;
    rooms.forEach((sockets, roomName) => {
        if (!io.sockets.adapter.sids.get(roomName)) { // Only log if it's a server-created room
            console.log(`Room: ${roomName}, Clients: ${sockets.size}`);
        }
    });
}


// Event handler for 'joinRoom'
function onJoinRoom(io, socket, roomCode) {
    const room = io.sockets.adapter.rooms.get(roomCode); // Get Socket.IO room
    const roomInfo = roomData.get(roomCode); // Get our metadata for the room

    if (room && roomInfo && room.size < 10) {
        const player = new Player(socket.id); // Direct instantiation of Player
        roomInfo.players.push(player); // Add player to our room metadata
        socket.join(roomCode);

        socket.emit('roomJoined', roomCode);
        io.to(roomCode).emit('updatePlayers', roomInfo.players);
    } else {
        socket.emit('error', 'Room is full or does not exist.');
    }
}

// Event handler for 'startGame'
function onStartGame(io, socket, roomCode) {
    const roomInfo = roomData.get(roomCode);

    if (roomInfo && roomInfo.players) {
        game.startGame(roomCode);
        io.to(roomCode).emit('gameStarted', roomInfo.players);
    } else {
        socket.emit('error', 'Room does not exist.');
    }
}

// Main connection handler
function onConnection(io, socket) {
    // createRoomManagerEventHandlers(io,socket)
    // createRoomEventHandlers(io,socket)
    // createPlayerEventHandlers(io,socket)
    socket.on('createRoom', () => roomManager.onCreateRoomEvent(io, socket));
    socket.on('joinRoom', (roomCode) => roomManager.onJoinRoom(io, socket, roomCode));
    socket.on('startGame', (roomCode) => onStartGame(io, socket, roomCode));
    socket.on('getNumOfPlayers', (roomCode) => roomManager.onGetNumOfPlayers(io, socket, roomCode));
}

module.exports = {
    onConnection
};
