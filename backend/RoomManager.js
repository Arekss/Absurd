const Player = require("./Player");

class RoomManager {
  constructor() {
    this.roomsData = new Map(); // Store rooms by roomCode
  }

  generateRoomCode() {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let roomCode;

    do {
      roomCode = "";
      for (let i = 0; i < 5; i++) {
        roomCode += characters.charAt(
          Math.floor(Math.random() * characters.length),
        );
      }
    } while (this.roomsData.has(roomCode)); // Repeat if the roomCode already exists

    return roomCode;
  }

  onSpecificClientDisconnect(io, socket)
  {

    // Sprawdź, czy pokój istnieje w `roomsData`
    const roomCode = socket.roomCode;
    if (this.roomsData.has(roomCode)) {
      const roomData = this.roomsData.get(roomCode);
    
      // Usuń gracza o danym `socket.id` z tablicy `players`
      roomData.players = roomData.players.filter(player => player.socketId !== socket.id);

      io.to(roomCode).emit("updatePlayers", roomData.players);
      // Jeśli po usunięciu gracza pokój jest pusty, usuń pokój z `roomsData`
      if (roomData.players.length === 0) {
        this.roomsData.delete(roomCode);
      }
    }
    else
    {
      console.log(`Error: roomCode ${roomCode} is not found in roomsData`);
    }

  }

  // Event handler for 'createRoom' button
  onCreateRoomEvent(io, socket, nickname) {
    const roomCode = this.generateRoomCode();
    socket.roomCode = roomCode;
    const player = new Player(socket.id, nickname); // Direct instantiation of Player

    socket.join(roomCode); // Use Socket.IO room management

    // Store room data in roomData Map
    this.roomsData.set(roomCode, {
      // map from roomCode to RoomData
      owner: socket.id,
      players: [player],
    });

    socket.emit("roomCreated", roomCode);
  }

  // Event handler for 'joinRoom'
  onJoinRoom(io, socket, roomCode, nickname) {
    const room = io.sockets.adapter.rooms.get(roomCode);
    const roomData = this.roomsData.get(roomCode);

    if (!roomData) {
      socket.emit("error", `Room with code ${roomCode} does not exist.`);
      return;
    }

    if (room && room.size >= 10) {
      socket.emit("error", `Room with code ${roomCode} is full.`);
      return;
    }

    // Check if player already exists in the room to prevent duplicates
    const playerExists = roomData.players.some(
      (player) => player.socketId === socket.id,
    );
    if (!playerExists) {
      const player = new Player(socket.id, nickname);
      roomData.players.push(player);

      // Join the socket to the room and emit update only if the player was added
      socket.join(roomCode);
      socket.emit("roomJoined", roomCode);
      io.to(roomCode).emit("updatePlayers", roomData.players);
    } else {
      // Optionally, send a message that the player is already in the room
      socket.emit("error", "You are already in this room.");
    }
  }

  onGetNumOfPlayers(io, socket, roomCode) {
    const room = io.sockets.adapter.rooms.get(roomCode);

    if (room) {
      // Emit the number of players in the room if it exists
      //socket.emit("numOfPlayers", room.players.length);
      console.log(`RoomCode: ${roomCode}, Clients: ${room.size}`);
    } else {
      // Emit an error if the room does not exist
      socket.emit("error", `Room with code ${roomCode} does not exist.`);
    }
  }
}

module.exports = RoomManager;
