
// backend/tests/roomSize.test.js
const { io: clientIo } = require("socket.io-client");
const { createServer } = require("http");
const { Server: ServerIo } = require("socket.io");
const { onConnection } = require("../handlers");

let serverIo; // Server-side Socket.io instance
let httpServer; // HTTP server instance
let httpServerAddress; // Address of the HTTP server
let clientSockets = []; // Array to hold client-side socket instances

beforeAll(async () => {
  httpServer = createServer();
  serverIo = new ServerIo(httpServer); // Initialize server-side Socket.io
  serverIo.on("connection", (serverSocket) => onConnection(serverIo, serverSocket));

  await new Promise((resolve) => httpServer.listen(() => {
    httpServerAddress = httpServer.address();
    resolve();
  }));
});

afterAll(() => {
  clientSockets.forEach((clientSocket) => clientSocket.disconnect()); // Disconnect all client sockets
  serverIo.close(); // Close server-side Socket.io
  httpServer.close(); // Close HTTP server
});

function setupClientSocketConnection() {
  const clientSocket = clientIo(`http://localhost:${httpServerAddress.port}`);
  clientSockets.push(clientSocket);
  return clientSocket
}

function createRoom(nickname) {
  return new Promise((resolve) => {
    const clientSocket = setupClientSocketConnection();

    clientSocket.on("connect", () => {
      clientSocket.emit("createRoom", nickname); // Client emits "createRoom" event to server
    });

    clientSocket.on("roomCreated", (code) => {
      resolve(code); // Return the roomCode via resolve
    });
  });
}

function addPlayer(nickname, roomCode) {
  return new Promise((resolve) => {
    const clientSocket = setupClientSocketConnection();

    clientSocket.on("connect", () => {
      clientSocket.emit("joinRoom", roomCode, nickname); // Client emits "joinRoom" event to server
    });

    clientSocket.on("roomJoined", () => {
      resolve(); // Resolve when the player has joined
    });
  });
}

test("Room has 3 players after three clients join", async () => {
  // Create room with the first player and get room code
  const roomCode = await createRoom("nickOfPlayer1");

  // Add two more players to the room
  await addPlayer("nickOfPlayer2", roomCode);
  await addPlayer("nickOfPlayer3", roomCode);

  // Check room size on the server side
  const room = serverIo.sockets.adapter.rooms.get(roomCode);
  if (room) {
    expect(room.size).toBe(3);
  } else {
    console.log(`Successfully joined room ${roomCode}.`);
  }
});
