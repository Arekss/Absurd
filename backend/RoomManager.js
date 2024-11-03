const Player = require("./Player");

class RoomManager {
  constructor() {
    this.roomsData = new Map(); // Store rooms by roomCode
  }

  generateRoomCode() {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return Array.from(
      { length: 5 },
      () => letters[Math.floor(Math.random() * letters.length)],
    ).join("");
  }

  // Event handler for 'createRoom' button
  onCreateRoomEvent(io, socket, nickname) {
    const roomCode = this.generateRoomCode();
    const player = new Player(socket.id, nickname); // Direct instantiation of Player

    socket.join(roomCode); // Use Socket.IO room management

    // Store room data in roomData Map
    this.roomsData.set(roomCode, {
      owner: socket.id,
      players: [player],
    });

    socket.emit("roomCreated", roomCode);
  }

  // Event handler for 'joinRoom'
  onJoinRoom(io, socket, roomCode) {
    const room = io.sockets.adapter.rooms.get(roomCode); // Get Socket.IO room
    const roomData = this.roomsData.get(roomCode); // Get our metadata for the room

    if (room && roomData && room.size < 10) {
      const player = new Player(socket.id, "placeholder"); // Direct instantiation of Player
      roomData.players.push(player); // Add player to our room metadata
      socket.join(roomCode);

      socket.emit("roomJoined", roomCode);
      io.to(roomCode).emit("updatePlayers", roomData.players);
    } else {
      socket.emit("error", "Room is full or does not exist.");
    }
  }

  onGetNumOfPlayers(io, socket, roomCode) {
    const room = io.sockets.adapter.rooms.get(roomCode);
    
      if (room) {
          console.log(`RoomCode: ${roomCode}, Clients: ${room.size}`);
     } else {
         console.log(`Room with code ${roomCode} does not exist.`);
     }
  }


}

module.exports = RoomManager;
