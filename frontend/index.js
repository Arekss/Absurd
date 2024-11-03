const socket = io();

// Connection status
socket.on('connect', () => {
    document.getElementById('status').textContent = 'Connected to server';
});
socket.on('disconnect', () => {
    document.getElementById('status').textContent = 'Disconnected from server';
});

// Create room button event
document.getElementById('createRoomBtn').addEventListener('click', () => {
    socket.emit('createRoom');
});

// Join room button event
document.getElementById('joinRoomBtn').addEventListener('click', () => {
    const roomCode = prompt("Enter 5-letter Room Code:");
    if (roomCode) {
        socket.emit('joinRoom', roomCode.toUpperCase());
      //  window.location.href = `/room/${roomCode.toUpperCase()}`;
    }
});

document.getElementById('GetNumOfPlayers').addEventListener('click', () => {
    socket.emit('getNumOfPlayers', socket.roomCode.toUpperCase());
});

// Handle room creation and joining responses
socket.on('roomCreated', (roomCode) => {
    socket.roomCode = roomCode;
    document.getElementById('roomCode').textContent = `Room Code: ${roomCode}`;
     //   window.location.href = `/room/${roomCode.toUpperCase()}`;
});

socket.on('roomJoined', (roomCode) => {
    socket.roomCode = roomCode;
    document.getElementById('roomCode').textContent = `Joined Room: ${roomCode}`;
});

socket.on('updatePlayers', (playerCount) => {
    document.getElementById('status').textContent = `Players in Room: ${playerCount}`;
});

socket.on('error', (message) => {
    alert(message);
});