const RoomManager = require("./RoomManager");
const Game = require("./Game");
const Player = require("./Player"); // Import Player directly for instantiation

const roomManager = new RoomManager();
const game = new Game(roomManager);

// Log all rooms and clients using Socket.IO's native rooms
function logRoomsAndClients(io) {
  const rooms = io.sockets.adapter.rooms;
  rooms.forEach((sockets, roomName) => {
    if (!io.sockets.adapter.sids.get(roomName)) {
      // Only log if it's a server-created room
      console.log(`Room: ${roomName}, Clients: ${sockets.size}`);
    }
  });
}

function onDisconnect(io,socket)
{
  roomManager.onDisconnect(io, socket);
}

function onConnection(io, socket) {
  // Room creation handler
  socket.on("createRoom", (nickname) => {
    try {
      roomManager.onCreateRoomEvent(io, socket, nickname);
      console.log("room created");
    } catch (error) {
      console.error("Error creating room:", error);
      socket.emit("error", "An error occurred while creating the room.");
    }
  });

  // Room joining handler
  socket.on("joinRoom", (roomCode, nickname) => {
    try {
      socket.roomCode = roomCode;
      roomManager.onJoinRoom(io, socket, roomCode, nickname);
    } catch (error) {
      console.error("Error joining room:", error);
      socket.emit("error", "An error occurred while joining the room.");
    }
  });


  socket.on("disconnect", () => {
    console.log(`client with socketId:${socket.id} disconnected from room:${socket.roomCode}`);
    roomManager.onSpecificClientDisconnect(io, socket); // Delegate to handlers
  });

  // Game start handler
  /* socket.on('startGame', (roomCode) => {
        try {
            onStartGame(io, socket, roomCode);
        } catch (error) {
            console.error("Error starting game:", error);
            socket.emit("error", "An error occurred while starting the game.");
        }
    }); */

  // Get number of players handler
  socket.on("getNumOfPlayers", (roomCode) => {
    try {
      roomManager.onGetNumOfPlayers(io, socket, roomCode);
    } catch (error) {
      console.error("Error getting number of players:", error);
      socket.emit(
        "error",
        "An error occurred while retrieving the number of players.",
      );
    }
  });
}

module.exports = {
  onConnection,
};
